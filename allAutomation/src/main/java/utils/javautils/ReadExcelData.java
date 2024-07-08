package utils.javautils;


import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

/**
 * ReadExcelData, is a utility class that provides methods for reading data from
 * an Excel file. The purpose of this class is to facilitate the extraction of
 * data from Excel sheets and convert it into a 2D array format. It uses the
 * Apache POI library to handle Excel file operations.
 * 
 * @author : Sanket Kumbhar
 */
public class ReadExcelData {

	private static XSSFSheet excelWSheet;
	private static XSSFWorkbook excelWBook;
	private static String excelPath;
	private static final ReadExcelData instance = new ReadExcelData();

	/**
	 * This method retrieves data from an Excel file and returns it as a 2D array.
	 * 
	 * @param filename  The name of the Excel file to be read.
	 * @param sheetName The name of the sheet within the Excel file.
	 * @return A 2D array containing the data from the Excel file.
	 * @throws Exception if there is an error reading the Excel file.
	 */

	public void setPath(String customPath) {
		ReadExcelData.excelPath = customPath;
	}

	public String getDefaultPath() {
		return excelPath;
	}

	public static ReadExcelData getInstance() {
		return instance;
	}

	@SuppressWarnings("static-access")
	public static Object[][] getExcelDataIn2DArray(String filename, String sheetName) {
		Object[][] excelDataArray = null;
		try {

			/**
			 * Open the Excel file for reading using FileInputStream object from java.io
			 * pass exact filepath as @param
			 * 
			 */

			FileInputStream ExcelFile = new FileInputStream(excelPath + filename);

			/**
			 * Create workbook instance to read that loaded Excel file
			 */

			excelWBook = new XSSFWorkbook(ExcelFile);
			/**
			 * @param sheetname - is the sheetname form excel file form which data gets
			 *                  extracted
			 */
			excelWSheet = excelWBook.getSheet(sheetName);

			// get number of columns and rows of the sheet
			int numOfColumns = excelWSheet.getRow(0).getPhysicalNumberOfCells();
			int numOfRows = excelWSheet.getPhysicalNumberOfRows();
			// create array to store data from excel sheet
			excelDataArray = new Object[numOfRows - 1][numOfColumns];

			// Itrerate throught each row x column form the sheet
			for (int i = 1; i < numOfRows; i++) {

				for (int j = 0; j < numOfColumns; j++) {

					XSSFRow row = excelWSheet.getRow(i);
					XSSFCell cell = row.getCell(j);

					/**
					 * Determine type of cell accordingly using cellType
					 * CellType.BLANK/STRING/NUMERIC/FORMULA
					 * 
					 */
					if (cell.getCellType() == CellType.STRING) {
						excelDataArray[i - 1][j] = excelWSheet.getRow(i).getCell(j).getStringCellValue();
					} else if (cell.getCellType() == CellType.NUMERIC) {
						excelDataArray[i - 1][j] = excelWSheet.getRow(i).getCell(j).getNumericCellValue();

					} else if (cell.getCellType() == CellType.FORMULA) {
						excelDataArray[i - 1][j] = excelWSheet.getRow(i).getCell(j).getCellFormula();
					} else if (cell.getCellType() == CellType.BLANK) {
						excelDataArray[i - 1][j] = excelWSheet.getRow(i).getCell(j).getRawValue();
					}

				}

			}
		}

		// Possible exceptions handled

		catch (FileNotFoundException e) {
			LoggerUtil.getInstance().getLogger().warning("=====File Not Found=====");
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}catch(Exception e) {
			e.printStackTrace();
		}
		return excelDataArray;
	}

}
