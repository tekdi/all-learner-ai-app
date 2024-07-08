package Tests;

import org.testng.annotations.Test;

public class RunSuite {
     @Test(priority = 0)
     void firstTest() throws Exception {
          System.out.println("Creating AllTest instance");
          AllTest at = new AllTest();
          System.out.println("Running Login test");
          at.Login();
     }
}
