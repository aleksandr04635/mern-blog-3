import { Alert, Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ModalComponent({ show, onClose, onConfirm, text }) {
  return (
    <div className=" flex items-center justify-center">
      <Modal
        show={show}
        onClose={onClose}
        popup
        size="md"
        className=" flex items-center justify-center  "
      >
        <div>
          <div className="border-main-border overflow-hidden rounded-lg border">
            <Modal.Header />
            <Modal.Body>
              <div className="text-center ">
                {/*    <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" /> */}
                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
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
