function _isIosDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export const isIosDevice = _isIosDevice();
