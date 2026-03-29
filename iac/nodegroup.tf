
resource "aws_eks_node_group" "nodes" {
  cluster_name    = aws_eks_cluster.eks.name
  node_group_name = "gitops-nodes"
  node_role_arn   = aws_iam_role.node_role.arn

  subnet_ids = [aws_subnet.private_1.id]

  scaling_config {
    desired_size = 1
    max_size     = 2
    min_size     = 1
  }

  instance_types = ["t3.medium"]
}