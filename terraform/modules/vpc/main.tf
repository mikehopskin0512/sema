
# Fetch AZs in the current region
data "aws_availability_zones" "available" {
}

resource "aws_vpc" "main" {
  cidr_block = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "vpc-${var.env}"
    Env  = var.env
  }
}

# Create var.az_count private subnets, each in a different AZ
resource "aws_subnet" "private" {
  count             = var.az_count
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  vpc_id            = aws_vpc.main.id
  tags = {
    Name = "vpc-${var.env}_private_${count.index + 1}"
    Env  = var.env
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
     Name = "vpc-${var.env}_public_${count.index + 1}"
     Env  = var.env
   }
 }

 # Create var.az_count database subnets, each in a different AZ
  resource "aws_subnet" "database" {
    count                   = var.az_count
    cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, var.az_count * 2 + count.index)
    availability_zone       = data.aws_availability_zones.available.names[count.index]
    vpc_id                  = aws_vpc.main.id
    tags = {
      Name = "vpc-${var.env}_database_${count.index + 1}"
      Env  = var.env
    }
  }

 # Internet Gateway for the public subnet
 resource "aws_internet_gateway" "gw" {
   vpc_id = aws_vpc.main.id
   tags = {
     Name = "igw-vpc-${var.env}"
     Env  = var.env
   }
 }

 # Create a new route table for the public subnets, and have it route the public subnet traffic through the IGW
 resource "aws_route_table" "public" {
   vpc_id = aws_vpc.main.id

   route {
     cidr_block = "0.0.0.0/0"
     gateway_id = aws_internet_gateway.gw.id
   }

   tags = {
     Name = "vpc-${var.env}_public"
     Env  = var.env
   }
 }

# Explicitly associate the newly created route table to the public subnets
 resource "aws_route_table_association" "public" {
   count          = var.az_count
   subnet_id      = element(aws_subnet.public.*.id, count.index)
   route_table_id = aws_route_table.public.id
 }

 # Route the public subnet traffic through the IGW (The vpc main route table automatically comes with your VPC. It controls the routing for all subnets that are not explicitly associated with any other route table (our public subnets).)
#   resource "aws_route" "internet_access" {
#     route_table_id         = aws_vpc.main.main_route_table_id
#     destination_cidr_block = "0.0.0.0/0"
#     gateway_id             = aws_internet_gateway.gw.id
#   }

  # Create a NAT gateway with an Elastic IP for each private subnet to get internet connectivity
   resource "aws_eip" "gw" {
     count      = var.az_count
     vpc        = true
     depends_on = [aws_internet_gateway.gw]
     tags = {
       Name = "vpc-${var.env}_eip_${count.index + 1}"
       Env  = var.env
     }
   }

   resource "aws_nat_gateway" "gw" {
     count         = var.az_count
     subnet_id     = element(aws_subnet.public.*.id, count.index)
     allocation_id = element(aws_eip.gw.*.id, count.index)
     tags = {
       Name = "vpc-${var.env}_nat_${count.index + 1}"
       Env  = var.env
     }
   }

   # Create a new route table for the private subnets, make it route non-local traffic through the NAT gateway to the internet
   resource "aws_route_table" "private" {
     count  = var.az_count
     vpc_id = aws_vpc.main.id

     route {
       cidr_block     = "0.0.0.0/0"
       nat_gateway_id = element(aws_nat_gateway.gw.*.id, count.index)
     }

#     route {
#       cidr_block     = "10.0.0.0/20"
#       vpc_peering_connection_id = "${var.vpn_peering_id}"
#     }

     tags = {
       Name = "vpc-${var.env}_private_${count.index + 1}"
       Env  = var.env
     }
   }

   # Explicitly associate the newly created route tables to the private subnets (so they don't default to the main route table)
   resource "aws_route_table_association" "private" {
     count          = var.az_count
     subnet_id      = element(aws_subnet.private.*.id, count.index)
     route_table_id = element(aws_route_table.private.*.id, count.index)
   }


#   resource "aws_vpc_peering_connection" "ohio" {
#     count = var.enable_peering ? 1 : 0
#
#     peer_vpc_id   = var.peer_vpc_id
#     vpc_id        = aws_vpc.main.id
#     peer_region   = "us-east-2"
#     #auto_accept = true
#
#     tags = {
#        Name = "Peering connection"
#     }
#   }

#   resource "aws_route" "primary2secondary" {
#     count = var.enable_peering ? var.az_count : 0
#
#     # ID of VPC 1 main route table.
#     route_table_id = element(aws_route_table.private.*.id, count.index)
#
#     # CIDR block / IP range for VPC 2.
#     destination_cidr_block = "10.0.0.0/20"
#
#     # ID of VPC peering connection.
#     vpc_peering_connection_id = aws_vpc_peering_connection.ohio[0].id
#   }
