import React from "react";
import { attachmentsAtom, skinsAtom } from "./store/spine";
import { useAtom } from "jotai";
import {
  attachmentsCache,
  handleAttachmentCheckboxChange,
  handleFilterInput,
  handlePMACheckboxChange,
} from "./js/events";
import { useTranslation } from "react-i18next";
import Filter from "./Filter";
import { skeletons } from "./js/spine-loader";

const SpineSettings: React.FC = ({}) => {
  const [attachments] = useAtom(attachmentsAtom);
  const [skins] = useAtom(skinsAtom);
  const { t } = useTranslation();

  let defaultIndex = 0;
  if (skins.length > 1 && skins[0].name === "default") {
    defaultIndex = 1;
  }

  return (
    <>
      <div className="item" id="pmaDiv">
        <label title="premultipliedAlpha">
          <span>{t("premultipliedAlpha")}</span>
          <input
            type="checkbox"
            onChange={(e) => {
              handlePMACheckboxChange(e);
            }}
          />
        </label>
      </div>
      <Filter onChange={handleFilterInput} />
      <div id="setting">
        <div id="attachment">
          {attachments.map(([name, index]) => {
            // FIXME state
            // @ts-ignore
            const isChecked = !attachmentsCache[name];
            return (
              <div className="item" key={name + index}>
                <label title={name}>
                  {name}
                  <input
                    type="checkbox"
                    data-old-index={index}
                    defaultChecked={isChecked}
                    onChange={handleAttachmentCheckboxChange}
                  />
                </label>
              </div>
            );
          })}
        </div>
        <div id="skin">
          {skins.map(([name], index) => (
            // FIXME state
            <div className="item" key={name}>
              <label title={name}>
                {name}
                <input
                  type="checkbox"
                  defaultChecked={defaultIndex === index}
                  onChange={(e) => {
                    // @ts-ignore
                    const skeleton = skeletons["0"].skeleton;
                    // @ts-ignore
                    const newSkin = new spine.Skin("_");
                    const checkboxes =
                      e.target.parentElement!.querySelectorAll<HTMLInputElement>(
                        "input[type='checkbox']",
                      );
                    skeleton.setSkin(null);
                    checkboxes.forEach((checkbox) => {
                      if (checkbox.checked) {
                        newSkin.addSkin(
                          skeleton.data.findSkin(
                            checkbox.parentElement!.textContent,
                          ),
                        );
                      }
                    });
                    skeleton.setSkin(newSkin);
                    skeleton.setToSetupPose();
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SpineSettings;
