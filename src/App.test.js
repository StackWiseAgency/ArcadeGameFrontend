import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Signin page heading", () => {
  render(<App />);

  // ✅ Change the expected text to match your UI
  const headingElement = screen.getByText(/Welcome to Fling Disc/i);
  expect(headingElement).toBeInTheDocument();
});
