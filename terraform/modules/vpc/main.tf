
# Fetch AZs in the current region
data "aws_availability_zones" "available" {
}

resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name      = "vpc-${var.env}"
    Env       = var.env
    Terraform = true
  }
}

# Create var.az_count private subnets, each in a different AZ
resource "aws_subnet" "private" {
  count             = var.az_count
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  vpc_id            = aws_vpc.main.id

  tags = {
    Name      = "vpc-${var.env}_private_${count.index + 1}"
    Env       = var.env
    Terraform = true
  }
}

# Create var.az_count public subnets, each in a different AZ
resource "aws_subnet" "public" {
  count                   = var.az_count
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, var.az_count + count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  vpc_id                  = aws_vpc.main.id
  map_public_ip_on_launch = true

  tags = {
    Name      = "vpc-${var.env}_public_${count.index + 1}"
    Env       = var.env
    Terraform = true
  }
}

# Create var.az_count database subnets, each in a different AZ
resource "aws_subnet" "database" {
  count             = var.az_count
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, var.az_count * 2 + count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  vpc_id            = aws_vpc.main.id

  tags = {
    Name      = "vpc-${var.env}_database_${count.index + 1}"
    Env       = var.env
    Terraform = true
  }
}

# Internet Gateway for the public subnet
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name      = "igw-vpc-${var.env}"
    Env       = var.env
    Terraform = true
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE THE PEERING CONNECTION TO US-EAST-2 (VPN) VPC
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_vpc_peering_connection" "pc" {
  peer_vpc_id = "vpc-03eb634f0651b5fb8"
  vpc_id      = aws_vpc.main.id
  peer_region = "us-east-2"

  # Important: these need to be set manually since peer is in another region
  #  accepter {
  #    allow_remote_vpc_dns_resolution = true
  #  }

  #  requester {
  #    allow_remote_vpc_dns_resolution = true
  #  }

  tags = {
    Name      = "vpc-${var.env}-vpn"
    Env       = var.env
    Terraform = true
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE THE PEERING CONNECTION TO US-EAST-2 (DEFAULT) VPC...THIS IS WHERE PROD AND QA SMP LIVE
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_vpc_peering_connection" "smp" {
  peer_vpc_id = "vpc-d75be4bf"
  vpc_id      = aws_vpc.main.id
  peer_region = "us-east-2"

  # Important: these need to be set manually since peer is in another region
  #  accepter {
  #    allow_remote_vpc_dns_resolution = true
  #  }

  #  requester {
  #    allow_remote_vpc_dns_resolution = true
  #  }

  tags = {
    Name      = "vpc-${var.env}-smp"
    Env       = var.env
    Terraform = true
  }
}

# Create a new route table for the public subnets, and have it route the public subnet traffic through the IGW
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name      = "vpc-${var.env}_public"
    Env       = var.env
    Terraform = true
  }
}

resource "aws_route" "public" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gw.id
}

resource "aws_route" "vpn" {
  route_table_id            = aws_route_table.public.id
  destination_cidr_block    = "10.0.0.0/20"
  vpc_peering_connection_id = aws_vpc_peering_connection.pc.id
}

resource "aws_route" "smp" {
  route_table_id            = aws_route_table.public.id
  destination_cidr_block    = "172.31.0.0/16"
  vpc_peering_connection_id = aws_vpc_peering_connection.smp.id
}

# Explicitly associate the newly created route table to the public subnets
resource "aws_route_table_association" "public" {
  count          = var.az_count
  subnet_id      = element(aws_subnet.public.*.id, count.index)
  route_table_id = aws_route_table.public.id
}

# Create a NAT gateway with an Elastic IP for each private subnet to get internet connectivity
resource "aws_eip" "gw" {
  vpc        = true
  depends_on = [aws_internet_gateway.gw]

  tags = {
    Name      = "vpc-${var.env}_eip"
    Env       = var.env
    Terraform = true
  }
}

resource "aws_nat_gateway" "gw" {
  subnet_id     = aws_subnet.public[0].id
  allocation_id = aws_eip.gw.id

  tags = {
    Name      = "vpc-${var.env}_nat"
    Env       = var.env
    Terraform = true
  }
}

# Create a new route table for the private subnets, make it route non-local traffic through the NAT gateway to the internet
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name      = "vpc-${var.env}_private"
    Env       = var.env
    Terraform = true
  }
}

resource "aws_route" "private" {
  nat_gateway_id         = aws_nat_gateway.gw.id
  destination_cidr_block = "0.0.0.0/0"
  route_table_id         = aws_route_table.private.id
}

resource "aws_route" "vpn" {
  route_table_id            = aws_route_table.private.id
  destination_cidr_block    = "10.0.0.0/20"
  vpc_peering_connection_id = aws_vpc_peering_connection.pc.id
}

resource "aws_route" "smp" {
  route_table_id            = aws_route_table.private.id
  destination_cidr_block    = "172.31.0.0/16"
  vpc_peering_connection_id = aws_vpc_peering_connection.smp.id
}

# Explicitly associate the newly created route tables to the private subnets (so they don't default to the main route table)
resource "aws_route_table_association" "private" {
  count          = var.az_count
  subnet_id      = element(aws_subnet.private.*.id, count.index)
  route_table_id = element(aws_route_table.private.*.id, count.index)
}
