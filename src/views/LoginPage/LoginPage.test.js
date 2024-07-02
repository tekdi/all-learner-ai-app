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
  test("when the user is on the login page, if the user tries to submit the form without entering a username and password, then an alert should appear with the message 'Please fill in all fields'", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields");
  });

  test("when the page is loaded, then the Login text should be there as a heading", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
  });

  test("when the user is on the login page, if the user enters the username and password and submits the form, then the user should be navigated to the '/discover-start' page, and localStorage should be updated with the profileName and virtualId", async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const mock = new MockAdapter(axios);
    mock
      .onPost(
        `${process.env.REACT_APP_VIRTUAL_ID_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=testuser`
      )
      .reply(200, { result: { virtualID: "12345" } });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "testpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(localStorage.getItem("profileName")).toBe("testuser")
    );
    await waitFor(() =>
      expect(localStorage.getItem("virtualId")).toBe("12345")
    );

    expect(mockNavigate).toHaveBeenCalledWith("/discover-start");
  });

  test("when the user is on the login page, if the user enters a username in the username field, then the username field should display the entered text", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    const usernameInput = screen.getByLabelText("Username");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    expect(usernameInput.value).toBe("testuser");
  });

  test("when the user is on the login page, if the user enters a password in the password field, then the password field should display the entered text in a masked format", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    expect(passwordInput.value).toBe("testpassword");
  });

  test("when the user is on the login page, if there is an error while making the API call during form submission, then an alert should appear with the message 'An error occurred. Please try again later.'", async () => {
    const mock = new MockAdapter(axios);
    mock
      .onPost(
        `${process.env.REACT_APP_VIRTUAL_ID_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=testuser`
      )
      .networkError();

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "testpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "An error occurred. Please try again later."
      )
    );
  });

  test("when the user is on the login page, if the login page is rendered, then the form should contain the username field, password field, and submit button also Login Text as heading", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
  });
});
