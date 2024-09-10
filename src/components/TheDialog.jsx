import { useState } from 'react'
import UploadIcon from '../assets/upload.png'
import PropTypes from 'prop-types'

const TheDialog = ({ onImport }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openDialog = () => setIsOpen(true)
  const closeDialog = (e) => {
    e.stopPropagation()
    setIsOpen(false)
  }

  const importFile = (e) => {
    onImport(e)
    closeDialog(e)
  }

  return (
    <div>
      <button onClick={openDialog} className="btn-success">
        匯入選手資料
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeDialog}></div>
          <div className="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center">
            <div className="rounded bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-bold">上傳檔案</h2>

              <form>
                <label
                  htmlFor="file_input"
                  className="mb-2 flex h-52 w-52 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-violet-400 hover:bg-gray-100"
                >
                  <img src={UploadIcon} alt="" className="mb-3 h-10 w-10" />
                  Upload File
                </label>
                <input
                  id="file_input"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={importFile}
                />
                <small className="text-gray-500">支持格式：JSON</small>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
TheDialog.propTypes = {
  onImport: PropTypes.func.isRequired
}

export default TheDialog
