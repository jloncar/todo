export interface BlockAttributes {
  heading: string;
}

export interface BlockEditProps {
  attributes: BlockAttributes;
  setAttributes: (attributes: BlockAttributes) => void;
}

export interface BlockSaveProps {
  attributes: BlockAttributes;
}
