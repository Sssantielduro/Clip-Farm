const chatBody = document.getElementById('chatBody');
const chatTips = [
  "Try adding a celebratory GIF in the third second to match the trend.",
  "Cross-platform caption: keep it concise for TikTok, elaborate a bit for Shorts.",
  "Use auto voice-over for silent clips and drop a CTA at the end.",
  "Schedule reels for peak hours—AI recommends 5 PM on weekdays."
];

let tipIndex = 0;
setInterval(() => {
  const tip = document.createElement('p');
  tip.textContent = chatTips[tipIndex];
  chatBody.prepend(tip);
  tipIndex = (tipIndex + 1) % chatTips.length;
  if (chatBody.children.length > 4) {
    chatBody.removeChild(chatBody.lastElementChild);
  }
}, 4000);

const sidebar = document.getElementById('sidebar');
const sidebarHandle = document.getElementById('sidebarHandle');
let isDragging = false;

if (sidebar && sidebarHandle) {
  const updateWidth = (clientX) => {
    const layoutRect = sidebar.parentElement.getBoundingClientRect();
    const rootStyles = getComputedStyle(document.documentElement);
    const minWidth = parseInt(rootStyles.getPropertyValue('--sidebar-min-width'), 10);
    const maxWidth = parseInt(rootStyles.getPropertyValue('--sidebar-max-width'), 10);
    let newWidth = clientX - layoutRect.left;
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    sidebar.style.width = `${newWidth}px`;
  };

  sidebarHandle.addEventListener('pointerdown', (event) => {
    isDragging = true;
    document.body.style.cursor = 'col-resize';
    sidebarHandle.setPointerCapture(event.pointerId);
    updateWidth(event.clientX);
    event.preventDefault();
  });

  document.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    updateWidth(event.clientX);
  });

  const stopDrag = (event) => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.cursor = 'auto';
    if (event && event.pointerId && sidebarHandle.hasPointerCapture?.(event.pointerId)) {
      sidebarHandle.releasePointerCapture(event.pointerId);
    }
  };

  document.addEventListener('pointerup', stopDrag);
  document.addEventListener('pointercancel', stopDrag);
}

  const dropzoneArea = document.querySelector('.dropzone-area');
  const dropzoneInfo = document.getElementById('dropzoneFileInfo');
  const clipInput = document.getElementById('clipInput');
  const browseButton = document.getElementById('browseButton');
  const projectItems = document.querySelectorAll('.project-list li');
  const dropzoneBadge = document.querySelector('.dropzone-badge');
  const drawerToggle = document.querySelector('.drawer-toggle');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mainScreen = document.querySelector('[data-screen="main"]');
  const previewScreen = document.querySelector('[data-screen="preview"]');
  const previewVideo = document.getElementById('previewVideo');
  const previewTitle = document.getElementById('previewTitle');
  const previewSize = document.getElementById('previewSize');
  const previewType = document.getElementById('previewType');
  let currentPreviewUrl = null;

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let index = 0;
    let value = bytes;
    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }
    return `${value.toFixed(1)} ${units[index]}`;
  };

  const showPreviewScreen = (file) => {
    if (!file) return;
    if (dropzoneArea) {
      dropzoneArea.classList.add('has-file');
    }
    if (dropzoneInfo) {
      dropzoneInfo.innerHTML = `<strong>${file.name}</strong><small>${formatBytes(file.size)}</small>`;
    }
    if (previewTitle) {
      previewTitle.textContent = file.name;
    }
    if (previewSize) {
      previewSize.textContent = `Size · ${formatBytes(file.size)}`;
    }
    if (previewType) {
      previewType.textContent = `Type · ${file.type || 'video/*'}`;
    }
    if (previewVideo) {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
      }
      currentPreviewUrl = URL.createObjectURL(file);
      previewVideo.src = currentPreviewUrl;
      previewVideo.load();
      previewVideo.pause();
      previewVideo.currentTime = 0;
    }
    if (mainScreen) {
      mainScreen.classList.add('hidden');
    }
    if (previewScreen) {
      previewScreen.classList.remove('hidden');
    }
  };

  const exitPreview = () => {
    if (previewVideo) {
      previewVideo.pause();
      previewVideo.removeAttribute('src');
    }
    if (currentPreviewUrl) {

  const toggleDrawer = (open) => {
    document.body.classList.toggle('drawer-open', open);
  };
      URL.revokeObjectURL(currentPreviewUrl);
      currentPreviewUrl = null;
    }
    if (previewScreen) {
      previewScreen.classList.add('hidden');
    }
    if (mainScreen) {
      mainScreen.classList.remove('hidden');
    }
  };

  const handleFiles = (files) => {
    if (!files || !files.length) return;
    const file = files[0];
    showPreviewScreen(file);
    if (clipInput) {
      clipInput.value = '';
    }
  };

  if (dropzoneArea) {
    const setDragState = (active) => {
      dropzoneArea.classList.toggle('drag-over', active);
    };

    dropzoneArea.addEventListener('dragover', (event) => {
      event.preventDefault();
      setDragState(true);
    });

    dropzoneArea.addEventListener('dragleave', () => setDragState(false));

    dropzoneArea.addEventListener('drop', (event) => {
      event.preventDefault();
      setDragState(false);
      const files = event.dataTransfer.files;
      handleFiles(files);
    });
  }

  if (browseButton && clipInput) {
    browseButton.addEventListener('click', () => clipInput.click());
    clipInput.addEventListener('change', (event) => handleFiles(event.target.files));
  }


  if (dropzoneBadge) {
    const queuedCount = Array.from(projectItems).reduce((sum, item) => {
      const clips = parseInt(item.dataset.clips, 10);
      return sum + (Number.isNaN(clips) ? 0 : clips);
    }, 0);
    if (queuedCount > 0) {
      dropzoneBadge.hidden = false;
      dropzoneBadge.textContent = `Running analysis · ${queuedCount} clip${queuedCount === 1 ? '' : 's'} queued`;
    } else {
      dropzoneBadge.hidden = true;
    }
  }

  if (drawerToggle) {
    drawerToggle.addEventListener('click', () => toggleDrawer(true));
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', () => toggleDrawer(false));
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', () => toggleDrawer(false));
  }
