"use client";
import { ReactNode, useState } from "react";
import { useModal } from "@/hooks/tailAdmin/useModal";
import { HorizontaLDots } from "../../icons";
import { Modal } from "../tailAdminUI/ui/modal";
import { Dropdown } from "../tailAdminUI/ui/dropdown/Dropdown";
import { DropdownItem } from "../tailAdminUI/ui/dropdown/DropdownItem";
import Label from "../tailAdminUI/components/form/Label";
import Input from "../tailAdminUI/components/form/input/InputField";
import Button from "../tailAdminUI/ui/button/Button";
import Switch from "../tailAdminUI/components/form/switch/Switch";

interface IntegrationCardTailAdminProps {
  title: string;
  icon: ReactNode;
  description: string;
  connect: boolean;
}

export default function IntegrationCardTailAdmin({
  title,
  icon,
  description,
  connect,
}: IntegrationCardTailAdminProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const deleteModal = useModal();

  return (
    <>
      <article className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="relative p-5 pb-9">
          <div className="mb-5 inline-flex h-10 w-10 items-center justify-center">
            {icon}
          </div>
          <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>
          <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
          <div className="absolute top-5 right-5 h-fit">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <HorizontaLDots className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={deleteModal.openModal}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Remove
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 p-5 dark:border-gray-800">
          <div className="flex gap-3">
            <IntegrationSettingsModal />
            <IntegrationDetailsModal />
          </div>
          <Switch defaultChecked={connect} />
        </div>
      </article>
      <IntegrationDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
      />
    </>
  );
}

interface IntegrationDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

function IntegrationDeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: IntegrationDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className=" relative w-full max-w-[558px] m-5 sm:m-0 rounded-3xl bg-white p-6 overflow-hidden lg:p-10 dark:bg-gray-900"
    >
      <div className="text-center">
        <div className="relative z-1 mb-7 flex items-center justify-center">
          <svg
            className="fill-error-50 dark:fill-error-500/15"
            width="90"
            height="90"
            viewBox="0 0 90 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
              fill=""
              fillOpacity=""
            />
          </svg>

          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
              className="fill-error-600 dark:fill-error-500"
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.62684 11.7496C9.04105 11.1638 9.04105 10.2141 9.62684 9.6283C10.2126 9.04252 11.1624 9.04252 11.7482 9.6283L18.9985 16.8786L26.2485 9.62851C26.8343 9.04273 27.7841 9.04273 28.3699 9.62851C28.9556 10.2143 28.9556 11.164 28.3699 11.7498L21.1198 18.9999L28.3699 26.25C28.9556 26.8358 28.9556 27.7855 28.3699 28.3713C27.7841 28.9571 26.8343 28.9571 26.2485 28.3713L18.9985 21.1212L11.7482 28.3715C11.1624 28.9573 10.2126 28.9573 9.62684 28.3715C9.04105 27.7857 9.04105 26.836 9.62684 26.2502L16.8771 18.9999L9.62684 11.7496Z"
                fill=""
              />
            </svg>
          </span>
        </div>

        <h4 className="sm:text-title-sm mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Action Needed!
        </h4>
        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
          Are you sure you want to remove this integration?
        </p>

        <div className="mt-8 flex w-full items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="shadow-theme-xs flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            No, cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (onConfirm) {
                onConfirm();
              }
              onClose();
            }}
            className="shadow-theme-xs flex justify-center rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-white hover:bg-red-600"
          >
            Yes, I&apos;m sure
          </button>
        </div>
      </div>
    </Modal>
  );
}

function IntegrationDetailsModal() {
  const detailsModal = useModal();
  return (
    <>
      <button
        onClick={detailsModal.openModal}
        className="shadow-theme-xs inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-400"
      >
        Details
      </button>

      <Modal
        isOpen={detailsModal.isOpen}
        onClose={detailsModal.closeModal}
        className=" relative w-full max-w-[558px] m-5 sm:m-0 rounded-3xl bg-white p-6 overflow-hidden lg:p-10 dark:bg-gray-900"
      >
        <div>
          <h4 className="text-title-xs mb-1 font-semibold text-gray-800 dark:text-white/90">
            Integration details
          </h4>
          <p className="mb-7 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Check the credentials and settings for your connected app.
          </p>
          <ul>
            <li className="flex justify-between border-b border-gray-100 py-2.5 dark:border-gray-800">
              <span className="w-1/2 text-sm text-gray-500 dark:text-gray-400">
                App Name
              </span>
              <span className="w-1/2 break-words text-gray-700 dark:text-gray-400">
                Example App
              </span>
            </li>
            <li className="flex justify-between border-b border-gray-100 py-2.5 dark:border-gray-800">
              <span className="w-1/2 text-sm text-gray-500 dark:text-gray-400">
                Client ID
              </span>
              <span className="w-1/2 break-words text-gray-700 dark:text-gray-400">
                872364219810-abc123xyz456.apps.usercontent.com
              </span>
            </li>
            <li className="flex justify-between border-b border-gray-100 py-2.5 dark:border-gray-800">
              <span className="w-1/2 text-sm text-gray-500 dark:text-gray-400">
                Client Secret
              </span>
              <span className="w-1/2 break-words text-gray-700 dark:text-gray-400">
                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e
              </span>
            </li>
            <li className="flex justify-between border-b border-gray-100 py-2.5 dark:border-gray-800">
              <span className="w-1/2 text-sm text-gray-500 dark:text-gray-400">
                Authentication base URI
              </span>
              <span className="w-1/2 break-words text-gray-700 dark:text-gray-400">
                https://accounts.app.com/o/oauth2/auth
              </span>
            </li>
          </ul>
        </div>
      </Modal>
    </>
  );
}

function IntegrationSettingsModal() {
  const settingsModal = useModal();
  return (
    <>
      <button
        onClick={settingsModal.openModal}
        className="shadow-theme-xs inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5.64615 4.59906C5.05459 4.25752 4.29808 4.46015 3.95654 5.05171L2.69321 7.23986C2.35175 7.83128 2.5544 8.58754 3.14582 8.92899C3.97016 9.40493 3.97017 10.5948 3.14583 11.0707C2.55441 11.4122 2.35178 12.1684 2.69323 12.7598L3.95657 14.948C4.2981 15.5395 5.05461 15.7422 5.64617 15.4006C6.4706 14.9247 7.50129 15.5196 7.50129 16.4715C7.50129 17.1545 8.05496 17.7082 8.73794 17.7082H11.2649C11.9478 17.7082 12.5013 17.1545 12.5013 16.4717C12.5013 15.5201 13.5315 14.9251 14.3556 15.401C14.9469 15.7423 15.7029 15.5397 16.0443 14.9485L17.3079 12.7598C17.6494 12.1684 17.4467 11.4121 16.8553 11.0707C16.031 10.5948 16.031 9.40494 16.8554 8.92902C17.4468 8.58757 17.6494 7.83133 17.3079 7.23992L16.0443 5.05123C15.7029 4.45996 14.9469 4.25737 14.3556 4.59874C13.5315 5.07456 12.5013 4.47961 12.5013 3.52798C12.5013 2.84515 11.9477 2.2915 11.2649 2.2915L8.73795 2.2915C8.05496 2.2915 7.50129 2.84518 7.50129 3.52816C7.50129 4.48015 6.47059 5.07505 5.64615 4.59906Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.5714 9.99977C12.5714 11.4196 11.4204 12.5706 10.0005 12.5706C8.58069 12.5706 7.42969 11.4196 7.42969 9.99977C7.42969 8.57994 8.58069 7.42894 10.0005 7.42894C11.4204 7.42894 12.5714 8.57994 12.5714 9.99977Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Modal
        isOpen={settingsModal.isOpen}
        onClose={settingsModal.closeModal}
        className="relative w-full max-w-[558px] rounded-3xl m-5 sm:m-0 bg-white p-6 lg:p-10 dark:bg-gray-900"
      >
        <div>
          <h4 className="text-title-xs mb-1 font-semibold text-gray-800 dark:text-white/90">
            Integration settings
          </h4>
          <p className="mb-7 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Manage and configure your connected apps and services
          </p>
          <form action="#">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 disabled:opacity-50 dark:text-gray-400">
                  Select App
                </label>
                <div
                  x-data="{ isOptionSelected: false }"
                  className="relative z-20 bg-transparent"
                >
                  <select
                    disabled
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  >
                    <option
                      defaultValue=""
                      className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                      Select Option
                    </option>
                    <option
                      defaultValue=""
                      className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                      Google Meet
                    </option>
                    <option
                      defaultValue=""
                      className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                      Mailchimp
                    </option>
                    <option
                      defaultValue=""
                      className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                      Zoom
                    </option>
                    <option
                      defaultValue=""
                      className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                      Loom
                    </option>
                    <option
                      defaultValue=""
                      className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                      Gmail
                    </option>
                  </select>
                  <span className="pointer-events-none absolute top-1/2 right-4 z-30 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <svg
                      className="stroke-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                        stroke=""
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <Label>Client ID</Label>
                <Input
                  type="text"
                  defaultValue="872364219810-abc123xyz456.apps.googleusercontent.com"
                />
              </div>
              <div>
                <Label>Client Secret</Label>
                <Input
                  type="text"
                  defaultValue="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e"
                />
              </div>
              <div>
                <Label>Authentication base URI</Label>
                <Input
                  type="text"
                  defaultValue="https://accounts.application.com/o/oauth2/auth"
                />
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Save your changes by clicking ‘Save Changes’
            </p>
          </form>
          <div className="mt-8 flex w-full flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              onClick={settingsModal.closeModal}
              className="w-full"
              variant="outline"
            >
              Close
            </Button>
            <Button className="w-full">Save Changes</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
