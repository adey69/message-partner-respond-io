export type Owner = {
  name: string;
  role: string;
  avatarUrl: string;
  email: string;
  phone: string;
  github: string;
};

/**
 * The developer this build belongs to, shown as the subject of the settings
 * screen. A field left empty is omitted from the screen rather than rendered
 * blank, so partial details still read as finished.
 */
export const owner: Owner = {
  name: 'Adnan',
  role: 'Mobile Developer',
  avatarUrl: '',
  email: 'madnan.pak69@gmail.com',
  phone: '',
  github: '',
};
