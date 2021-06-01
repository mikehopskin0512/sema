output "vpc_name" {
  value = "${aws_vpc.main.id}"
}

output "vpc_cidr" {
  value = "${aws_vpc.main.cidr_block}"
}

output "private_subnet_ids" {
  value = "${aws_subnet.private.*.id}"
}

output "public_subnet_ids" {
  value = "${aws_subnet.public.*.id}"
}

output "gateway_id" {
  value = "${aws_internet_gateway.gw.id}"
}

output "nat_gateway_id" {
  value = "${aws_nat_gateway.gw.id}"
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "private_route_table" {
  value = aws_route_table.private.id
}

output "public_route_table" {
  value = aws_route_table.public.id
}

output "vpc_route_table" {
  value = aws_vpc.main.main_route_table_id
}
