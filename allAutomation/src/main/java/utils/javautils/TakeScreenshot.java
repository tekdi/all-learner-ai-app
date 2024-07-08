package utils.javautils;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.io.FileHandler;

import java.io.File;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Date;

/**
 * TakeScreenshot, is a utility class that provides methods for capturing
 * screenshots using Selenium WebDriver.
 * 
 * @author : Sanket Kumbhar
 * 
 */
public class TakeScreenshot {

	private String fileName = "";
	String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());

	/**
	 * Takes a screenshot of the current WebDriver instance and saves it as a file.
	 * 
	 * @param driver     -- The WebDriver instance.
	 * @param filename-- The filename for the screenshot.
	 * @throws Exception --if there is an error while capturing or saving the
	 *                   screenshot.
	 * 
	 */

	public void screenshot(WebDriver driver, String filename) {
		try {

		fileName = filename + "_" + timestamp;
		File source = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
		System.out.println(fileName);
		String parentDirectory = System.getProperty("user.dir") + java.io.File.separator + "screenshots"
				+ java.io.File.separator;
		createDirectory(parentDirectory); // Create the directory with timestamp
		File destination = new File(
				parentDirectory + java.io.File.separator + timestamp + java.io.File.separator + fileName + ".png");
		FileHandler.copy(source, destination);

		FileHandler.copy(source, destination);
		}
		catch(Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Creates a directory with the specified path.
	 * 
	 * @param parentDirectory The parent directory path.
	 */

	private void createDirectory(String parentDirectory) {

		String directoryPath = parentDirectory + java.io.File.separator + timestamp;
		File directory = new File(directoryPath);
		// Create the directory and any necessary parent directories
		directory.mkdirs();
	}

	// to delete old files

	private static TakeScreenshot instance;
	private String directoryPath;

	public TakeScreenshot() {
		// Set the directory path where the report file are stored
		directoryPath = System.getProperty("user.dir") + java.io.File.separator + "screenshots"
				+ java.io.File.separator;

	}

	public static TakeScreenshot getInstance() {
		if (instance == null) {
			synchronized (TakeScreenshot.class) {
				if (instance == null) {
					instance = new TakeScreenshot();
				}
			}
		}
		return instance;
	}

	@SuppressWarnings("static-access")
	public void deleteOldScreenshot(int days) {
		// Calculate the deletion threshold date

		/*
		 * here localdate object from java.time used to calculate date usign minus () in
		 * that mention days then it will get substracted from current day suppose day
		 * 5running then it will delete 3day
		 * 
		 */
		LocalDate deletionThreshold = LocalDate.now().minus(days, ChronoUnit.DAYS);

		// Get the list of files in the directory
		File directory = new File(directoryPath);
		File[] files = directory.listFiles();

		// Iterate through the files and delete if older than the threshold
		for (File file : files) {
			LocalDate fileDate = LocalDate.ofEpochDay(file.lastModified() / (24 * 60 * 60 * 1000));

			if (fileDate.isBefore(deletionThreshold)) {
				// Delete the file
				if (file.delete()) {
					LoggerUtil.getInstance().getLogger().info("Deleted file: " + file.getName());
//					System.out.println();
				} else {
					LoggerUtil.getInstance().getLogger().info("Failed to delete file: " + file.getName());
				}
			}
		}
	}

}
