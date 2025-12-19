const chatBody = document.getElementById('chatBody');
const chatTips = [
  "Try adding a celebratory GIF in the third second to match the trend.",
  "Cross-platform caption: keep it concise for TikTok, elaborate a bit for Shorts.",
  "Use auto voice-over for silent clips and drop a CTA at the end.",
  "Schedule reels for peak hours—AI recommends 5 PM on weekdays."
];

if (chatBody) {
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
}

const initializeApp = () => {
  const dropzoneArea = document.querySelector('.dropzone-area');
  const dropzoneInfo = document.getElementById('dropzoneFileInfo');
  const clipInput = document.getElementById('clipInput');
  const browseButton = document.getElementById('browseButton');
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

  const toggleDrawer = (open) => {
    const drawerEl = document.getElementById('drawer');
    const backdropEl = document.getElementById('drawerBackdrop');
    document.body.classList.toggle('drawer-open', open);
    if (drawerEl) drawerEl.setAttribute('aria-hidden', String(!open));
    if (backdropEl) backdropEl.setAttribute('aria-hidden', String(!open));
    if (open) {
      const closeBtn = drawerEl?.querySelector('.drawer-close');
      closeBtn?.focus();
    }
  };
  const profileIcon = document.querySelector('.profile-icon');

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
    const projectItems = document.querySelectorAll('.project-list li');
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

  if (profileIcon) {
    profileIcon.addEventListener('click', () => toggleDrawer(true));
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', () => toggleDrawer(false));
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', () => toggleDrawer(false));
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}
      toggleDrawer(false);
      setTimeout(() => { window.location.href = './index.html'; }, 160);
    });
  }

  const newProjectForm = document.getElementById('newProjectForm');
  const newProjectName = document.getElementById('newProjectName');
  const newProjectGoal = document.getElementById('newProjectGoal');
  const recentProjectsList = document.getElementById('recentProjects');
  const recentPlaceholder = document.getElementById('recentPlaceholder');
  const allProjectsList = document.getElementById('allProjectsList');
  const allPlaceholder = document.getElementById('allPlaceholder');
  if (newProjectForm && newProjectName && recentProjectsList) {
    newProjectForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = newProjectName.value.trim();
      if (!name) return;
      const goal = newProjectGoal?.value.trim() || 'Fresh idea';
      const newItem = document.createElement('li');
      newItem.dataset.clips = '0';
      newItem.innerHTML = `
        <div>
          <strong>${name}</strong>
          <small>${goal}</small>
        </div>
        <span class=\"project-status\">Draft</span>
      `;
      recentProjectsList.prepend(newItem);
      if (recentPlaceholder) {
        recentPlaceholder.hidden = true;
      }
      if (allProjectsList) {
        const allItem = newItem.cloneNode(true);
        allProjectsList.prepend(allItem);
        if (allPlaceholder) {
          allPlaceholder.remove();
        }
      }
      newProjectForm.reset();
      newProjectName.focus();
    });
  }

  const envForm = document.getElementById('envFinderForm');
  const envList = document.getElementById('envList');
  const envNameInput = document.getElementById('envNameInput');
  if (envForm && envList && envNameInput) {
    envForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const label = envNameInput.value.trim();
      if (!label) return;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'env-chip';
      chip.textContent = label;
      envList.appendChild(chip);
      envNameInput.value = '';
      envNameInput.focus();
    });
  }

  const styleChips = document.querySelectorAll('.style-chip');
  if (styleChips.length) {
    styleChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        styleChips.forEach((other) => other.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  }

  const projectIdDisplay = document.getElementById('projectIdDisplay');
  const projectNameDisplay = document.getElementById('projectNameDisplay');
  const projectStyleDisplay = document.getElementById('projectStyleDisplay');
  const projectGoalDisplay = document.getElementById('projectGoalDisplay');
  if (projectIdDisplay || projectNameDisplay || projectStyleDisplay || projectGoalDisplay) {
    const params = new URLSearchParams(window.location.search);
    const projectIdValue = params.get('projectId') || '—';
    const projectName = params.get('projectName') || 'Untitled project';
    const projectStyle = params.get('style') || 'Balanced flow';
    const projectGoal = params.get('goal') || 'Clips are queued for Auto-Edit.';
    if (projectIdDisplay) {
      projectIdDisplay.textContent = `ID · ${projectIdValue}`;
    }
    if (projectNameDisplay) {
      projectNameDisplay.textContent = projectName;
    }
    if (projectStyleDisplay) {
      projectStyleDisplay.textContent = `Editing style · ${projectStyle}`;
    }
    if (projectGoalDisplay) {
      projectGoalDisplay.textContent = projectGoal;
    }
  }

  const PROJECT_FOLDERS_KEY = 'clipfarm-project-folders';
  const DEFAULT_PROJECT_FOLDERS = ['Recent Farm IDs', 'Draft exports', 'Platform-ready stacks'];
  const ASSETS_ACTIVE_PANEL_KEY = 'clipfarm-assets-active-panel';
  const selectionTitle = document.getElementById('selectionTitle');
  const selectionContent = document.getElementById('selectionContent');
  const folderItems = document.querySelectorAll('.folder-item[data-panel]');

  const sanitizeFolderName = (value) => {
    if (!value) return '';
    return value.replace(/[<>:"/\\|?*]/g, '').trim();
  };

  const getProjectFolders = () => {
    try {
      const stored = localStorage.getItem(PROJECT_FOLDERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {}
    return [];
  };

  const setProjectFolders = (folders) => {
    try {
      localStorage.setItem(PROJECT_FOLDERS_KEY, JSON.stringify(folders));
    } catch (error) {}
  };

  const getActivePanel = () => {
    return localStorage.getItem(ASSETS_ACTIVE_PANEL_KEY) || 'projects';
  };

  const setActivePanel = (panelKey) => {
    try {
      localStorage.setItem(ASSETS_ACTIVE_PANEL_KEY, panelKey);
    } catch (error) {}
  };

  const selectionData = {
    projects: {
      title: 'Projects',
      description: 'Folders for every project ID you farmed. This column previews the files that will live in the tertiary pane.',
      fallback: DEFAULT_PROJECT_FOLDERS
    },
    environments: {
      title: 'Environments',
      description: 'Groupings that organize projects by vibe or campaign. This column previews the contents tied to each grouping.',
      fallback: ['Campaign Orbit', 'Daily Hooks', 'Studio Lab']
    }
  };

  const setActiveFolderVisual = (panelKey) => {
    if (!folderItems.length) return;
    folderItems.forEach((item) => {
      item.classList.toggle('active', item.dataset.panel === panelKey);
    });
  };

  const renderSelection = (panelKey) => {
    const data = selectionData[panelKey];
    if (!data || !selectionContent || !selectionTitle) return;
    selectionTitle.textContent = data.title;
    const dynamicProjects = panelKey === 'projects' ? getProjectFolders() : [];
    const entries = [
      ...dynamicProjects.map((item) => ({ text: item, dynamic: true })),
      ...((data.fallback || []).map((item) => ({ text: item, dynamic: false })))
    ];
    if (!entries.length) {
      selectionContent.innerHTML = `<p class="selection-description">No folders tracked yet.</p>`;
      return;
    }
    selectionContent.innerHTML = `
      <p class="selection-description">${data.description}</p>
      <ul>
        ${entries.map((entry) => `<li>${entry.dynamic ? `<strong>${entry.text}</strong>` : entry.text}</li>`).join('')}
      </ul>
    `;
  };

  const addProjectFolder = (folderName) => {
    const safeName = sanitizeFolderName(folderName);
    if (!safeName) return;
    const existing = getProjectFolders();
    const updated = [safeName, ...existing.filter((item) => item !== safeName)];
    setProjectFolders(updated.slice(0, 12));
    setActivePanel('projects');
    setActiveFolderVisual('projects');
    renderSelection('projects');
  };

  if (folderItems.length) {
    const currentPanel = getActivePanel();
    folderItems.forEach((item) => {
      item.addEventListener('click', () => {
        const panelKey = item.dataset.panel;
        setActivePanel(panelKey);
        setActiveFolderVisual(panelKey);
        renderSelection(panelKey);
      });
    });
    const fallbackItem = Array.from(folderItems).find((item) => item.dataset.panel === currentPanel) || folderItems[0];
    if (fallbackItem) {
      setActivePanel(fallbackItem.dataset.panel);
      setActiveFolderVisual(fallbackItem.dataset.panel);
      renderSelection(fallbackItem.dataset.panel);
    } else {
      setActivePanel('projects');
      renderSelection('projects');
    }
  }

  const farmButton = document.querySelector('.farm-action');
  if (farmButton) {
    farmButton.addEventListener('click', (event) => {
      event.preventDefault();
      const projectId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `proj-${Date.now()}`;
      const projectNameText = previewTitle?.textContent?.trim() || 'Untitled clip';
      const activeStyle = document.querySelector('.style-chip.active')?.textContent?.trim() || 'Balanced flow';
      addProjectFolder(projectNameText);
      const params = new URLSearchParams({
        projectId,
        projectName: projectNameText,
        style: activeStyle,
        goal: 'Clips farmed into a dedicated project page.'
      });
      const targetUrl = `project.html?${params.toString()}`;
      if (previewScreen) {
        previewScreen.classList.add('hidden');
      }
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 180);
    });
  }
};

document.addEventListener('DOMContentLoaded', initializeApp);
