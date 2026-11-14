import React, { createContext, useCallback, useContext, useState } from 'react'
import Modal from './Modal'
import { cn } from '../../utils/format'

const ConfirmContext = createContext(() => Promise.resolve(false))

/** useConfirm() -> (opts) => Promise<boolean> */
export const useConfirm = () => useContext(ConfirmContext)

export function ConfirmProvider({ children }) {
  const [cfg, setCfg] = useState(null)

  const confirm = useCallback(
    (opts) =>
      new Promise((resolve) => {
        setCfg({
          title: 'Are you sure?',
          message: '',
          confirmLabel: 'Confirm',
          cancelLabel: 'Cancel',
          ...opts,
          resolve,
        })
      }),
    [],
  )

  const close = useCallback((value) => {
    setCfg((c) => {
      c?.resolve?.(value)
      return null
    })
  }, [])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {cfg && (
        <Modal open onClose={() => close(false)} maxWidth="max-w-sm">
          <div className="p-6">
            <h3 className="font-display text-sm uppercase tracking-[.14em]">{cfg.title}</h3>
            {cfg.message && <p className="mt-3 text-sm leading-relaxed text-muted">{cfg.message}</p>}
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => close(false)} className="btn-outline py-3">
                {cfg.cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className={cn('btn-primary py-3', cfg.confirmTextClassName)}
              >
                {cfg.confirmLabel}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </ConfirmContext.Provider>
  )
}
