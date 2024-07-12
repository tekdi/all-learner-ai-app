# test_example.py
def add(x, y):
    return x + y


def test_add():
    assert add(3, 4) == 7
    assert add(1, 1) == 2

    print("Added two parameters",add(10, 20))
