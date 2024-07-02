import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import config from "../../utils/urlConstants.json";

jest.spyOn(window, "alert").mockImplementation(() => {});

describe("LoginPage", () => {
  test("shows alert when fields are empty", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(window.alert).toHaveBeenCalledWith("Please fill in all fields");
  });

  test("navigates to /discover-start on successful login", async () => {
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
  });

  test("displays entered username", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    const usernameInput = screen.getByLabelText("Username");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    expect(usernameInput.value).toBe("testuser");
  });

  test("displays entered password", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    expect(passwordInput.value).toBe("testpassword");
  });

  test("shows alert on API error", async () => {
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

  test("clears localStorage on form submission", async () => {
    const mock = new MockAdapter(axios);
    mock
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
  });

  test("renders form fields correctly", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });
});
