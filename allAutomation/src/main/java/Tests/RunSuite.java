package Tests;

import org.testng.annotations.Test;

public class RunSuite {
@Test(priority = 0)
void firstTest() throws Exception {
     AllTest at = new AllTest();
     at.Login();
}

}
