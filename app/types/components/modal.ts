export interface ModalUi {
  header: string
  body: string
  content: string
  close?: string
}

export interface ModalProps {
  ui?: Partial<ModalUi>
  showClose?: boolean
  preventClose?: boolean
}

export interface ModalDrawerProps {
  ui?: Partial<ModalUi>
  showClose?: boolean
}

export interface ModalSlideoverProps {
  ui?: Partial<ModalUi> & {
    overlay?: string
  }
}
