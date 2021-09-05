export enum ThemeType {
  Light = 'Light',
  Dark = 'Dark',
}

export const LightColor: { [key: string]: string } = {
  '--text-primary': '#303133',
  '--text-regular': '#606266',
  '--text-secondary': '#909399',
  '--placeholder': '#c0c4cc',
  '--border-darker': '#b0bec5',
  '--border-base': '#cfd8dc',
  '--border-lighter': '#eceff1',
  '--background-darker': '#e0e0e0',
  '--background-base': '#eeeeee',
  '--background-lighter': '#f5f5f5',
};

export const DarkColor: { [key: string]: string } = {
  '--text-primary': '#f8f8ff',
  '--text-regular': '#c0c0c0',
  '--text-secondary': '#a9a9a9',
  '--placeholder': '#718093',
  '--border-darker': '#11131B',
  '--border-base': '#1e272e',
  '--border-lighter': '#2f3640',
  '--background-darker': '#161823',
  '--background-base': '#292d3e',
  '--background-lighter': '#353b48',
};

export const ThemeColor: { [key in ThemeType]: any } = {
  Light: LightColor,
  Dark: DarkColor,
};
