package Tests;

import Pages.LoginPage;
import com.sun.speech.freetts.Voice;
import com.sun.speech.freetts.VoiceManager;
import com.sun.speech.freetts.audio.SingleFileAudioPlayer;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.Test;
import utils.javautils.BaseUtils;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.time.Duration;
import java.util.Base64;

public class RunSuite {
     @Test(priority = 0)
     void firstTest() throws Exception {
          System.out.println("Creating AllTest instance");
          AllTest at = new AllTest();
          System.out.println("Running Login test");
          at.Login();
     }
}






//     @Test
//     public static void Login() throws Exception {
//          browserRun();
//          LoginPage lp = PageFactory.initElements(BaseUtils.driver,LoginPage.class);
//
//          logStep("Enter username");
//          driver.findElement(By.id(":r0:")).sendKeys("Amol");
//
//          waitForUi(2);
//          logStep("Enter password");
//          driver.findElement(By.id(":r1:")).sendKeys("Amol@123");
//
//          logStep("Click on the Login button");
//
//          driver.findElement(By.xpath("//button[@type='submit']")).click();
//
//          waitForUi(2);
//
//          Thread.sleep(3000);
//
//          logStep("Click on Start assessment button");
//
//          driver.findElement(By.xpath("//div[@class='MuiBox-root css-14j5rrt']")).click();
//
//          Thread.sleep(3000);
//
//          logStep("Get Text from UI");
//          assertTrue("Mike button is enables",driver.findElement(By.xpath("//h4[@class='MuiTypography-root MuiTypography-h5 css-xilszg']")).isDisplayed(),"Mike button is not enabled");
//
//          String Text = driver.findElement(By.xpath("//h4[@class='MuiTypography-root MuiTypography-h5 css-xilszg']")).getText();
//
//          logStep("Click on the Mike button");
//          Thread.sleep(3000);
//          WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
//          WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@class='MuiBox-root css-1l4w6pd']")));
//          assertTrue("Mike button is enabled",driver.findElement(By.xpath("//*[@class='MuiBox-root css-1l4w6pd']")).isDisplayed(),"Mike button is not enabled");
//
//          element.click();
//
//          logStep(Text);
//
//          TexttoSpeach(Text);
//
//
//          Thread.sleep(4000);
//          logStep("Click on Stop button");
//          driver.findElement(By.xpath("(//*[@xmlns='http://www.w3.org/2000/svg'])[2]")).click();
//
//          Thread.sleep(2000);
//
//          logStep("Click on Continue button");
//          driver.findElement(By.xpath("//*[@class='MuiBox-root css-1fhz53j']")).click();
//
//          Thread.sleep(2000);
//          driver.findElement(By.xpath("(//*[@xmlns='http://www.w3.org/2000/svg'])[2]")).sendKeys("allAutomation/src/main/java/Pages/output_audio.wav");
//
//
//          Thread.sleep(4000);
//          logStep("Click on Next Button");
//          driver.findElement(By.xpath("//*[@class='MuiBox-root css-140ohgs']")).click();
//
//     }
//
//
//     private static String convertWavToBase64(String filePath) {
//          String base64String = "";
//          try {
//               File file = new File(filePath);
//               byte[] bytes = Files.readAllBytes(file.toPath());
//               base64String = Base64.getEncoder().encodeToString(bytes);
//          } catch (IOException e) {
//               e.printStackTrace();
//          }
//          return base64String;
//     }
//
//     private static void saveBase64ToFile(String filePath, String base64String) {
//          try (FileWriter fileWriter = new FileWriter(filePath)) {
//               fileWriter.write(base64String);
//          } catch (IOException e) {
//               e.printStackTrace();
//          }
//     }

//
//
//     private static void TexttoSpeach(String Text) throws InterruptedException {
//          System.setProperty("freetts.voices", "com.sun.speech.freetts.en.us.cmu_us_kal.KevinVoiceDirectory");
//
//          logStep("Speak text in Mike");
//          // Create a voice manager
//          VoiceManager voiceManager = VoiceManager.getInstance();
//
//          // Select the voice
//          Voice voice = voiceManager.getVoice("kevin16");
//          if (voice == null) {
//               System.err.println("Cannot find a voice named kevin16.\n" +
//                       "Please specify a different voice.");
//               System.exit(1);
//          }
//
//          // Allocate the chosen voice
//          voice.allocate();
//          voice.speak(Text);
//
//
//
//          // Ensure the directory exists
//          String directoryPath = "src/main/java/Pages"; // Adjust this path as needed
//          String fileName = "output_audio"; // Adjust the file name as needed
//          String outputPath = directoryPath + "/" + fileName + ".wav";
//
//          // Create directory if it doesn't exist
//          File directory = new File(directoryPath);
//          if (!directory.exists()) {
//               directory.mkdirs();
//          }
//
//          // Create a SingleFileAudioPlayer
//          SingleFileAudioPlayer audioPlayer = new SingleFileAudioPlayer(outputPath, javax.sound.sampled.AudioFileFormat.Type.WAVE);
//          voice.setAudioPlayer(audioPlayer);
//
//          voice.speak(Text);
//
//          audioPlayer.close();
//          // Deallocate the voice resources
//          voice.deallocate();
//
//          System.out.println("Audio file created successfully at: " + outputPath);
//
//          // Convert audio file to Base64
//          String base64Audio = convertWavToBase64(outputPath);
//          System.out.println("Base64 Audio: " + base64Audio);
//
//          // Save Base64 string to a file
//          String base64FilePath = directoryPath + "/Base64Audio.txt";
//          saveBase64ToFile(base64FilePath, base64Audio);
//          System.out.println("Base64 Audio saved successfully at: " + base64FilePath);
//     }
//
//
//
//}