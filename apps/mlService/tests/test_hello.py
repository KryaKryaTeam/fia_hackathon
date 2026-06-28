"""Hello unit test module."""

from mlService.hello import hello


def test_hello():
    """Test the hello function."""
    assert hello() == "Hello mlService"
