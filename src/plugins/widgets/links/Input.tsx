import icons from "feather-icons/dist/icons.json";
import React, { FC } from "react";

import {
  IconButton,
  RemoveIcon,
  DownIcon,
  UpIcon,
} from "../../../views/shared";
import { Link } from "./types";

type Props = Link & {
  number: number;
  onChange: (values: Partial<Link>) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove: () => void;
};

const sanitizeSvg = (svgString: string) => {
  return svgString.replace(/(width|height)="[^"]*"/g, ''); // Remove width and height
};

const iconList = Object.keys(icons);

const Input: FC<Props> = (props) => {
  const isGoogleOrFavicone = props.icon === "_favicon_google" || props.icon === "_favicon_favicone";
  const isCustomIconify = props.icon === "_custom_iconify";
  const isCustomSvg = props.icon === "_custom_svg";
  const isCustomICON = props.icon === "_custom_ico";
  const isCustomUpload = props.icon === "_custom_upload";

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        if (file.type === 'image/svg+xml') {
          props.onChange({
            uploadedIconData: sanitizeSvg(result),
            uploadedIconType: 'svg',
            uploadedIconSize: props.uploadedIconSize || 24
          });
        } else if (file.type === 'image/x-icon') {
          props.onChange({
            uploadedIconData: result,
            uploadedIconType: 'ico',
            uploadedIconSize: props.uploadedIconSize || 24
          });
        } else {
          props.onChange({
            uploadedIconData: result,
            uploadedIconType: 'image',
            uploadedIconSize: props.uploadedIconSize || 24
          });
        }
      }
    };

    if (file.type === 'image/svg+xml') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="LinkInput">
      <h5>
        <div className="title--buttons">
          <IconButton onClick={props.onRemove} title="Remove link">
            <RemoveIcon />
          </IconButton>
          {props.onMoveDown && (
            <IconButton onClick={props.onMoveDown} title="Move link down">
              <DownIcon />
            </IconButton>
          )}
          {props.onMoveUp && (
            <IconButton onClick={props.onMoveUp} title="Move link up">
              <UpIcon />
            </IconButton>
          )}
        </div>

        {props.number <= 9 ? `Keyboard shortcut ${props.number}` : "Shortcut"}
      </h5>

      <label>
        URL
        <input
          type="url"
          value={props.url}
          onChange={(event) => props.onChange({ url: event.target.value })}
        />
      </label>

      <label>
        Name <span className="text--grey">(optional)</span>
        <input
          type="text"
          value={props.name}
          onChange={(event) => props.onChange({ name: event.target.value })}
        />
      </label>

      <label>
        Icon <span className="text--grey">(optional)</span>
        <select
          value={props.icon}
          onChange={(event) => props.onChange({ icon: event.target.value })}
        >
          <option value={""}>None</option>
          <optgroup label="Website Icons">
            <option value="_favicon_google">From Google</option>
            <option value="_favicon_duckduckgo">From DuckDuckGo</option>
            <option value="_favicon_favicone">From Favicone</option>
          </optgroup>
          <optgroup label="Custom">
            <option value="_custom_iconify">From Iconify</option>
            <option value="_custom_svg">Custom SVG HTML</option>
            <option value="_custom_ico">Custom ICO url</option>
            <option value="_custom_upload">Upload Custom Icon</option>
          </optgroup>
          <optgroup label="Feather Icons">
            {iconList.map((key) => (
              <option key={key}>{key}</option>
            ))}
          </optgroup>
        </select>
      </label>

      {isGoogleOrFavicone && (
        <label>
          Icon Size
          <select
            onChange={(event) => props.onChange({ iconSize: Number(event.target.value) })}
          >
            <option value="16">16x16</option>
            <option value="32">32x32</option>
            <option value="64">64x64</option>
            <option value="128">128x128</option>
            <option value="256">256x256</option>
          </select>
        </label>
      )}

      {isCustomIconify && (
        <label>
          Custom Iconify Identifier
          <input
            type="text"
            onChange={(event) => props.onChange({ IconString: event.target.value })}
          />
          <p>
            Enter the iconify identifier for the icon you want to use in your links. For more detailed info see&nbsp;
            <a href="https://github.com/BookCatKid/tabliss-maintained/issues/3#issuecomment-2676456153" target="_blank" rel="noopener noreferrer">this GitHub issue</a>.
          </p>
        </label>
      )}

      {isCustomSvg && (
        <label>
          Custom SVG HTML
          <textarea
            value={sanitizeSvg(props.SvgString || '')}
            onChange={(event) => props.onChange({ SvgString: sanitizeSvg(event.target.value) })}
          />
          <p>
            Enter your custom SVG HTML code above to use an icon in your links. For more detailed info see&nbsp;
            <a href="https://github.com/BookCatKid/tabliss-maintained/issues/3#issuecomment-2676456153" target="_blank" rel="noopener noreferrer">this GitHub issue</a>.
          </p>
        </label>
      )}

      {isCustomSvg && (
        <label>
          Custom SVG Size
          <input
            type="number"
            value={props.customIconSize}
            onChange={(event) => props.onChange({ customIconSize: Number(event.target.value) })}
          />
        </label>
      )}

      {isCustomICON && (
        <label>
          Custom ICO url
          <input
            type="text"
            value={props.IconStringIco}
            onChange={(event) => props.onChange({ IconStringIco: event.target.value })}
          />
          <p>Enter a url on the internet for a .ico file</p>
        </label>
      )}

      {isCustomUpload && (
        <>
          <label>
            Upload Icon
            <input
              type="file"
              accept="image/*,.svg,.ico"
              onChange={handleFileUpload}
            />
          </label>
          
          {props.uploadedIconData && (
            <div className="icon-preview" style={{ marginTop: '10px', textAlign: 'center' }}>
              <p>Preview:</p>
              {props.uploadedIconType === 'svg' ? (
                <span
                  className="custom-svg-preview"
                  style={{
                    width: `100%`,
                    height: `auto`,
                    }}
                  dangerouslySetInnerHTML={{ __html: props.uploadedIconData }}
                />
              ) : (
                <img
                  src={props.uploadedIconData}
                  alt="Icon Preview"
                  style={{
                    width: `100%`,
                    height: `auto`,
                    objectFit: 'contain'
                  }}
                />
              )}
              
              <label style={{ display: 'block', marginTop: '10px' }}>
                Icon Size
                <input
                  type="number"
                  step="1"
                  min="16"
                  max="640"
                  value={props.uploadedIconSize}
                  onChange={(event) => props.onChange({ uploadedIconSize: Number(event.target.value) })}
                />
              </label>
            </div>
          )}
        </>
      )}
      <hr />
    </div>
  );
};

export default Input;

