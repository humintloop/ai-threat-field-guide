import { ArrowLeft } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { PageTransition } from "../components/Motion";

export function NotFoundPage() {
  return <PageTransition><div className="not-found"><span>404 / Record not found</span><h1>This thread ends here.</h1><p>The requested record is not present in the current field guide dataset.</p><Link className="button" to="/"><ArrowLeft size={17} /> Return home</Link></div></PageTransition>;
}
