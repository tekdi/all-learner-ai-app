import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import config from "../../utils/urlConstants.json";
import { useNavigate } from "react-router-dom";

jest.spyOn(window, "alert").mockImplementation(() => {});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("LoginPage", () => {
  let mockNavigate;
  let mockAxios;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  test("shows alert when fields are empty", () => {
    // Given the LoginPage is rendered
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // When the login button is clicked
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Then an alert should be shown indicating fields are empty
    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields");
  });

  test("navigates to /discover-start on successful login", async () => {
    // Given the LoginPage is rendered
    mockAxios
      .onPost(
        `${process.env.REACT_APP_VIRTUAL_ID_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=testuser`
      )
      .reply(200, { result: { virtualID: "12345" } });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // When the user enters a valid username and password and clicks login
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "testpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Then localStorage should be set with the username and virtualId
    await waitFor(() =>
      expect(localStorage.getItem("profileName")).toBe("testuser")
    );
    await waitFor(() =>
      expect(localStorage.getItem("virtualId")).toBe("12345")
    );

    // And the user should be navigated to /discover-start
    expect(mockNavigate).toHaveBeenCalledWith("/discover-start");
  });

  test("displays entered username", () => {
    // Given the LoginPage is rendered
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // When the user enters a username
    const usernameInput = screen.getByLabelText("Username");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    // Then the username input should display the entered value
    expect(usernameInput.value).toBe("testuser");
  });

  test("displays entered password", () => {
    // Given the LoginPage is rendered
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // When the user enters a password
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    // Then the password input should display the entered value
    expect(passwordInput.value).toBe("testpassword");
  });

  test("shows alert on API error", async () => {
    // Given the LoginPage is rendered
    mockAxios
      .onPost(
        `${process.env.REACT_APP_VIRTUAL_ID_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=testuser`
      )
      .networkError();

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // When the user enters a valid username and password and clicks login
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "testpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Then an alert should be shown indicating an API error
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "An error occurred. Please try again later."
      )
    );
  });

  test("Set localStorage on form submission", async () => {
    // Given the LoginPage is rendered and localStorage has initial values
    mockAxios
      .onPost(
        `${process.env.REACT_APP_VIRTUAL_ID_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=testuser`
      )
      .reply(200, { result: { virtualID: "12345" } });

    localStorage.setItem("profileName", "oldProfileName");
    localStorage.setItem("virtualId", "oldVirtualId");

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // When the user enters a valid username and password and clicks login
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "testpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Then localStorage should be updated with the new values
    await waitFor(() =>
      expect(localStorage.getItem("profileName")).toBe("testuser")
    );
    await waitFor(() =>
      expect(localStorage.getItem("virtualId")).toBe("12345")
    );
  });

  test("renders form fields correctly", () => {
    // Given the LoginPage is rendered
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Then the username, password fields and login button should be in the document
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });
});
