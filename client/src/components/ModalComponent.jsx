import { Alert, Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { customModalTheme } from "../../customFlowbiteThemes";
import { useSelector } from "react-redux";

export default function ModalComponent({ show, onClose, onConfirm, text }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className=" flex items-center justify-center">
      <div className={theme}>
        <Modal
          show={show}
          onClose={onClose}
          popup
          size="md"
          className=" flex items-center justify-center  "
          theme={customModalTheme}
        >
          {/*              "dark-active-bg": "#151e37",
        "active-bg": "#f2faff",
        "dark-main-bg": "#10172a",
        "dark-additional-bg": "#1f2937",
        "secondary-border": "#6366F1",
        "light-additional-bg": "#ffffff",
        "main-border": "#078493",
        "layout-border": "#0a5b6b",
        "additional-text": "#374151",
        "dark-additional-text": "#E5E7EB", */}
          <div className={theme}>
            <div className="overflow-hidden rounded-lg border border-main-border dark:bg-dark-main-bg">
              <Modal.Header />
              <Modal.Body>
                <div className="text-center ">
                  {/*  <HiOutlineExclamationCircle className="mx-auto mb-4  h-14 w-14" /> */}
                  {/* <h3 className="mb-5 text-lg text-additional-text dark:text-dark-additional-text"> */}
                  <h3 className="mb-5  text-lg text-additional-text dark:text-white">
                    {text}
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={onConfirm}>
                      Confirm
                    </Button>
                    <Button color="gray" onClick={onClose}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
