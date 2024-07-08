package test.Intranet;

import com.aventstack.extentreports.Status;
import org.openqa.selenium.support.PageFactory;
import org.testng.ITestResult;
import org.testng.annotations.*;
import pom.Intranet.Intranet_Login;
import utils.baseutils.BrowserManager;
import utils.javautils.LoggerUtil;
import utils.javautils.PropertiesFileManager;
import utils.javautils.Reporter;
import utils.javautils.TakeScreenshot;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.Properties;
import java.util.logging.Logger;

public class IntranetLogin_Test extends BrowserManager{
    Logger logger = LoggerUtil.getLogger();
    BrowserManager bm = new BrowserManager();
    TakeScreenshot tss = new TakeScreenshot();
    PropertiesFileManager loader = PropertiesFileManager.getInstance();
    Properties loginCred = loader.getProperties("LoginCred.properties");
    public String Uname = loginCred.getProperty("username");
    public String Pword = loginCred.getProperty("password");
//Test

//    static {
//        ReadExcelData.getInstance().setPath(System.getProperty("user.dir") + "/src/test/java/test/resources/Test_data/");
//
//    }






    @BeforeSuite
    public void generateReport() {
        logger.info("Generating Test Report");
        Reporter.setupReport("Test_Report");
    }

    @BeforeMethod
    public void setupOpen() throws Exception {
        logger.info("Setting up the browser...");
        bm.browserRun();

    }

    @AfterMethod
    public void setupClose(ITestResult result) throws Exception {
        if (result.FAILURE == result.getStatus()) {
            logger.warning("Test  failed. Capturing Screenshot...");
            tss.screenshot(bm.driver, " test case");
        }
        Reporter.reportonTestResult(result, bm.driver);

      bm.driver.close();
    }

    @AfterClass
    public void reportFlush() {

        Reporter.flushReport();
    }


    //With MS Excel

//    @DataProvider(name = "Intranet_Login")
//    public Object[][] creator_tcdata() throws Exception {
//        logger.info("Fetching data from the data provider");
//        Object[][] testData = ReadExcelData.getExcelDataIn2DArray("sampleTest.xlsx", "login");
//        return testData;
//    }


//    @Test(dataProvider ="Intranet_Login" )
//    public void tc_01_Login(String username, String pass,Method testMethodName) {
//        LoggerUtil.startTimeMeasurement();
//        logger.info("Executing tc_01_Login Test Cases");
//        Reporter.createTest(testMethodName.getName());
//        IntranetLogin IL = PageFactory.initElements(bm.driver, IntranetLogin.class);
//        Reporter.logStep(Status.INFO, "Steps performed according to tc_01_Login Test Cases");
//        IL.tc_01_Login(username,pass);
//        LoggerUtil.stopTimeMeasurement("tc_01_Login Test Cases Execution Completed");
//    }



    //Without MS Excel
    @Test
    public void Intranet_Login(Method testMethodName) throws InterruptedException, IOException {
        LoggerUtil.startTimeMeasurement();
        logger.info("Executing Test Case");
        Reporter.createTest(testMethodName.getName());

        Intranet_Login login = PageFactory.initElements(bm.driver, Intranet_Login.class);
        Reporter.logStep( "Steps performed according to Test Cases");


        //Steps:
//        login.enterUsername(Uname);
        login.enterPassword(Pword);
        login.loginBtn();


        LoggerUtil.stopTimeMeasurement("Test Case Execution Completed");
    }


}
