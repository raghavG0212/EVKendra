import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsInstagram, BsTwitterX, BsGithub } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";
import { MdHowToVote } from "react-icons/md";

export default function FooterCom() {
  return (
    <Footer
      container
      className="footer border-t-8 border-teal-500 dark:border-teal-600 bg-slate-200"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link to="/">
              <div className="flex items-center bg-gradient-to-r from-orange-500  via-white to-green-700 px-3 py-2 rounded-md text-2xl sm:text-3xl lg:text-4xl">
                <MdHowToVote className="text-blue-800" />
                <span className="font-medium text-slate-950">
                  EV
                  <span className="text-md font-light font-mono ml-[2px] ">
                    kendra
                  </span>{" "}
                </span>
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 mt-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
            <div className="mt-2 sm:mt-0">
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.eci.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Election Commission Of India
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  // target="_blank"
                  rel="noopener noreferrer"
                >
                  EVkendra
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Github</Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  href="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <div className="flex space-x-1">
            <Footer.Copyright
              href="#"
              by="EVkendra"
              year={new Date().getFullYear()}
            />
          </div>
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon
              href="https://www.linkedin.com/in/raghav-goel-rg/"
              target="_blank"
              icon={FaLinkedinIn}
            />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitterX} />
            <Footer.Icon
              href="https://github.com/raghavG0212"
              target="_blank"
              icon={BsGithub}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}
