"""Setup script for Sanskrit MCP Server."""
from setuptools import setup, find_packages

setup(
    name="sanskrit-mcp-server",
    version="1.0.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    python_requires=">=3.11",
)
