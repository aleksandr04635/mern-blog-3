import { Alert, Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { customModalTheme } from "../../customFlowbiteThemes";

export default function ModalComponent({ show, onClose, onConfirm, text }) {
  return (
    <div className=" flex items-center justify-center">
      <Modal
        show={show}
        onClose={onClose}
        popup
        size="md"
        className=" flex items-center justify-center  "
        theme={customModalTheme}
      >
        <div>
          <div className="overflow-hidden rounded-lg border border-main-border ">
            <Modal.Header />
            <Modal.Body>
              <div className="text-center ">
                <HiOutlineExclamationCircle className="mx-auto mb-4  h-14 w-14" />
                {/* <h3 className="mb-5 text-lg text-additional-text dark:text-dark-additional-text"> */}
                <h3 className="mb-5  text-lg text-additional-text dark:text-dark-additional-text">
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
  );
}
