export interface Rights {
  status_right: boolean | undefined | null
  level_menu: string | undefined | null
  id_menu: string |undefined | null
  id: string |undefined | null
  nama: string |undefined | null
  value_checkbox : boolean | undefined | null
  indeterminate : boolean | undefined | null
  child: Rights
}
