import { Link } from "react-router-dom";
const PageNotFound = () => {
  return (
    <div>
      <h1>Page Not Found</h1>
      <p>Sorry, there is nothing to see here.</p>
      <p><Link to="/">Back to Home</Link></p>
    </div>
  );
}
export default PageNotFound;