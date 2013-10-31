var curPosElem, curBlockElem, amountBlocksElem, yLevElem;

function updateCurPosElem(){
    curPosElem.textContent = "(x: " + voxelPosition.x + " y: " + voxelPosition.y + " z: " + voxelPosition.z + ")";
}

function updateCurBlockElem(){
    curBlockElem.textContent = blockKeys[curBlockIndex] + " (" + curBlockIndex + "/" + (blockKeys.length-1) + ")";
}

function updateCurBlockAmountElem(){
    amountBlocksElem.textContent = "Amount of blocks: " + cubes.length;
}

function updateYLevElem(){
    yLevElem.textContent = "Current yLevel: " + yLevel;
}

function setupSidebar(){
    sidebar = document.createElement( 'div' );
    sidebar.style.float = "left";
    sidebar.style.width = "" + sidebarWidth + "px";
    sidebar.style.height = "100%";
    sidebar.style.position = "absolute";
    sidebar.style.right = "0%";
    sidebar.style.zIndex = 1;
    sidebar.style.backgroundColor = "blue";
    document.body.appendChild(sidebar);

    curPosElem = document.createElement( 'div' );
    curPosElem.textContent = "hi";
    sidebar.appendChild(curPosElem);

    curBlockElem = document.createElement( 'div' );
    curBlockElem.textContent = "stuff";
    updateCurBlockElem();
    sidebar.appendChild(curBlockElem);

    amountBlocksElem = document.createElement( 'div' );
    updateCurBlockAmountElem();
    sidebar.appendChild(amountBlocksElem);

    yLevElem = document.createElement( 'div' );
    updateYLevElem();
    sidebar.appendChild(yLevElem);

    var upBlock = document.createElement( 'button' );
    upBlock.onclick = function(){setCurrentBlockByIndex(curBlockIndex-1);};
    upBlock.textContent = "Current block-1(O)";
    sidebar.appendChild(upBlock);

    var downBlock = document.createElement( 'button' );
    downBlock.onclick = function(){setCurrentBlockByIndex(curBlockIndex+1);};
    downBlock.textContent = "Current block+1(P)";
    sidebar.appendChild(downBlock);

    var upYLev = document.createElement( 'button' );
    upYLev.onclick = function(){setYLevel(yLevel + 1);};
    upYLev.textContent = "Up Y-Level(J)";
    sidebar.appendChild(upYLev);

    var downYLev = document.createElement( 'button' );
    downYLev.onclick = function(){setYLevel(yLevel - 1);};
    downYLev.textContent = "Down Y-Level(K)";
    sidebar.appendChild(downYLev);
    
    var saveElem = document.createElement( 'button' );
    saveElem.onclick = cubes2JSON;
    saveElem.textContent = "Save level";
    sidebar.appendChild(saveElem);

    var loadElem = document.createElement( 'input' );
    loadElem.type = "file";
    loadElem.id = "files";
    loadElem.name = "files[]";
    loadElem.multiple = "";
    loadElem.textContent = "Save level";
    sidebar.appendChild(loadElem);

    loadElem.addEventListener('change', handleFileLoad, false);
}

