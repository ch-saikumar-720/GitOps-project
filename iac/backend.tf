terraform {
  backend "s3" {
    bucket = "gitops-iac-terraform-state"
    key    = "statefile/terraform.tfstate"
    region = "us-east-1"
  }
}