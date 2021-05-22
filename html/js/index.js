const noneFoundYet = "Not yet!";
const loading = "Loading...";
const minerNotFound = "Miner not found";

const genesisBaseTarget = 4398046511104 / 240;

let maxSubmissions = "Unknown";

var averageCommitmentNQT = 0;

var effective_values = 0;

/*
Show the Wallet name g_name = true
Show the Wallet address g_name = false
*/
var g_name = true;

/*
Show expolorer link g_link = true
Not show expolorer link g_link = false
*/
var g_link = true;

let miners = new Array(0);
const colors = [
    "#3366CC",
    "#DC3912",
    "#FF9900",
    "#109618",
    "#990099",
    "#3B3EAC",
    "#0099C6",
    "#DD4477",
    "#66AA00",
    "#B82E2E",
    "#316395",
    "#994499",
    "#22AA99",
    "#AAAA11",
    "#6633CC",
    "#E67300",
    "#8B0707",
    "#329262",
    "#5574A6",
    "#3B3EAC"
];

const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

let infoModalClassic = 0;
let infoModalPhoenix = 0;

var size = 1000;
var currentRoundDeadline = [];

function infoModalLoad() {
	document.getElementById("RA1").src="./img/BURST_Classic/RA1.png";
	document.getElementById("RA2").src="./img/BURST_Classic/RA2.png";
	document.getElementById("set_name1").src="./img/BURST_Classic/set_name1.png";
	document.getElementById("set_name2").src="./img/BURST_Classic/set_name2.png";
}

function infoModalBTDEXLoad() {
	document.getElementById("BTDEX_1").src="./img/BTDEX/1.png";
	document.getElementById("BTDEX_2").src="./img/BTDEX/2.png";
	document.getElementById("BTDEX_3").src="./img/BTDEX/3.png";
	document.getElementById("BTDEX_4").src="./img/BTDEX/4.png";
	document.getElementById("BTDEX_5").src="./img/BTDEX/5.png";
	document.getElementById("BTDEX_6").src="./img/BTDEX/6.png";
	document.getElementById("BTDEX_7").src="./img/BTDEX/7.png";
}

function escapeHtml(string) {
    return typeof string === 'string' ? String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    }) : string;
}

let chart = null;

function filterTimePart(part, suffix) {
    if (part === 0) {
        part = null;
    } else {
        part = part.toString() + suffix;
    }
    return part;
}

function formatTime(secs) {
    secs = parseInt(secs, 10);
    if (secs === null || secs < 0) return "";
    if (secs === 0) return "0s";
    let years = filterTimePart(Math.floor(secs / 3600 / 24 / 365), "y");
    let days = filterTimePart(Math.floor((secs / 3600 / 24) % 365), "d");
    let hours = filterTimePart(Math.floor((secs / 3600) % 24), "h");
    let minutes = filterTimePart(Math.floor(secs / 60) % 60, "m");
    let seconds = filterTimePart(secs % 60, "s");

    let result = "";
    if (years !== null) result += " " + years;
    if (days !== null) result += " " + days;
    if (hours !== null) result += " " + hours;
    if (minutes !== null) result += " " + minutes;
    if (seconds !== null) result += " " + seconds;
    return result.substr(1);
}

function formatBaseTarget(baseTarget) {
    return formatCapacity(genesisBaseTarget / baseTarget);
}

function getPoolInfo() {
    fetch("/api/getConfig").then(http => {
        return http.json();
    }).then(response => {
        maxSubmissions = response.nAvg + response.processLag;
        document.getElementById("poolName").innerText = response.poolName;
        document.getElementById("poolAccount").innerHTML = formatMinerName(response.explorer, response.poolAccountRS, response.poolAccount, null, g_link, g_name);
        document.getElementById("nAvg").innerText = response.nAvg;
        document.getElementById("nMin").innerText = response.nMin;
        document.getElementById("maxDeadline").innerText = response.maxDeadline;
        document.getElementById("processLag").innerText = response.processLag + " Blocks";
        document.getElementById("feeRecipient").innerHTML = formatMinerName(response.explorer, response.feeRecipientRS, response.feeRecipient, null, g_link, g_name);
        document.getElementById("poolFee").innerText = (parseFloat(response.poolFeePercentage)*100).toFixed(2) + " %";
        document.getElementById("donationRecipient").innerHTML = formatMinerName(response.explorer, response.donationRecipientRS, response.donationRecipient, null, g_link, g_name);
        document.getElementById("donationPercent").innerText = parseFloat(response.donationPercent).toFixed(2) + " %"; + " %";
        document.getElementById("poolShare").innerText = (100 - parseFloat(response.winnerRewardPercentage)*100).toFixed(2) + " %";
        document.getElementById("minimumPayout").innerText = response.defaultMinimumPayout + " BURST";
        document.getElementById("minPayoutsAtOnce").innerText = response.minPayoutsPerTransaction;
        document.getElementById("payoutTxFee").innerText = response.transactionFee + " BURST";
        document.getElementById("poolVersion").innerText = response.version;
    });
}

let roundStart = 0;

function updateRoundElapsed() {
    document.getElementById("currentRoundElapsed").innerText = formatTime(parseInt((new Date().getTime() / 1000).toFixed()) - roundStart);
}

function getCurrentRound() {
    fetch("/api/getCurrentRound").then(http => {
        return http.json();
    }).then(response => {
        roundStart = response.roundStart;
		averageCommitmentNQT = Math.round(response.miningInfo.averageCommitmentNQT / 1e8);
        document.getElementById("blockHeight").innerText = response.miningInfo.height;
        document.getElementById("netDiff").innerText = formatBaseTarget(response.miningInfo.baseTarget);
        document.getElementById("avComm").innerText = Math.round(response.miningInfo.averageCommitmentNQT / 1e8).toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.))/gm, '\'') + ' BURST/TiB';
		document.getElementById("newtworkCommittedBalance").innerText = (parseFloat(genesisBaseTarget / response.miningInfo.baseTarget) * Math.round(response.miningInfo.averageCommitmentNQT / 1e8)).toFixed(2).replace(/(?!^)(?=(?:\d{3})+(?:\.))/gm, '\'') + ' BURST';
if (response.bestDeadline != null) {
            document.getElementById("bestDeadline").innerText = formatTime(response.bestDeadline.deadline);
            document.getElementById("bestMiner").innerHTML = formatMinerName(response.bestDeadline.explorer, response.bestDeadline.minerRS, response.bestDeadline.miner, response.bestDeadline.name, g_link, g_name);
			/* document.getElementById("bestNonce").innerText = response.bestDeadline.nonce;*/
        } else {
            document.getElementById("bestDeadline").innerText = noneFoundYet;
            document.getElementById("bestMiner").innerText = noneFoundYet;
            /* document.getElementById("bestNonce").innerText = noneFoundYet; */
        }
    });
}

function getAccountExplorerLink(explorer, id) {
    return explorer + id;
}

function formatMinerName(explorer, rs, id, name, includeLink, includeName) {
    name = escapeHtml(name);
    rs = escapeHtml(rs);
	if(includeName)
	{
		name = name == null || name === "" ? rs : name;
	}
	else{
		name = rs;
	}
    if (includeLink) {
        return "<a href=\"" + getAccountExplorerLink(explorer, id) + "\" target=\"_blank\">" + name + "</a>";
    }
    return name;
}

function getTop10Miners() {
    fetch("/api/getTop10Miners").then(http => {
        return http.json();
    }).then(response => {
        let topTenMiners = response.topMiners;
        let topMinerNames = Array();
        let topMinerData = Array();
        let minerColors = colors.slice(0, topTenMiners.length + 1);
        for (let i = 0; i < topTenMiners.length; i++) {
            let miner = topTenMiners[i];
            topMinerNames.push(formatMinerName(response.explorer, miner.addressRS, miner.address, miner.name, false, g_name));
            topMinerData.push({value: miner.share * 100, name: topMinerNames[topMinerNames.length - 1]});
        }
        topMinerNames.push("Other");
        topMinerData.push({value: response.othersShare * 100, name: topMinerNames[topMinerNames.length - 1]});
        if (chart == null) {
            chart = echarts.init(document.getElementById("sharesChart"));
        }

        var option = {

            textStyle: {
                 color: 'rgba(255, 255, 255, 0.8)'
                       },

            tooltip: {
                trigger: 'item',
                formatter: '{b} ({d}%)'
            },
            legend: {
                textStyle: {
                 color: 'rgba(255, 255, 255, 0.8)'
                       },
                orient: 'vertical',
                left: 290,
                top: 10,
                data: topMinerNames
            },
            series: [
                {
                    name: 'Pool Shares',
                    type: 'pie',
		    radius: '80%',
                    center: ['160px', '150px'],
                    avoidLabelOverlap: true,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                        show: true,
                        fontSize: '20'
                        }
                    },
                    labelLine: {
                        show: true
                    },
                    data: topMinerData
                }
            ]
        };
        chart.setOption(option);

    });
}

function changeTable() {
	effective_values++;
	if(effective_values > 1) {
		effective_values = 0;
	}
	redrawMinersTable();
}

let miner = [];
let serverResponse;

function getMiners() {
    fetch("/api/getMiners").then(http => {
        return http.json();
    }).then(response => {

		serverResponse = response;

		for (let i = 0; i < serverResponse.miners.length; i++) {
				let deadlinefontStyle = "text";
				miner[i] = serverResponse.miners[i];

		}

		redrawMinersTable();

	});
}

	function redrawMinersTable() {

        let tableHead = document.getElementById("minersThead");
		let tableBody = document.getElementById("minersTbody");


		switch (effective_values) {
			case 0:
			tableHead.innerHTML = "<tr> <th><p><button onclick=\"changeTable()\" style=\"border: 1px solid #dee2e6;\">Change Table View</button></p>Miner</th>"
			+"<th>Current Deadline</th>"
			+"<th>Pending Balance</th>"
			+"<th>Total Capacity</th>"
			+"<th>Shared Capacity</th>"
			+"<th>Boosted Total Capacity</th>"
			+"<th>Boosted Shared Capacity</th>"
			+"<th>Committed Balance</th>"
			+"<th>Average Commitment</th>"
			+"<th>Commitment Ratio</th>"
			+"<th>Average Boost</th>"
			+"<th>Share Model</th>"
			+"<th>Donation Percent</th>"
			+"<th>Confirmed Deadlines</th>"
			+"<th>Pool Share</th>"
			+"<th>Software</th> </tr>";

			tableBody.innerHTML = "";
			for (let i = 0; i < serverResponse.miners.length; i++) {
				let deadlinefontStyle = "text";

				if(currentRoundDeadline[i] == "Loading...") {

					deadlinefontStyle = "text";

					if(miner[i].currentRoundBestDeadline != null) {
						currentRoundDeadline[i] = formatTime(miner[i].currentRoundBestDeadline);
					}

				}
				else {

					if(miner[i].currentRoundBestDeadline != null) {

						deadlinefontStyle = "text";

						currentRoundDeadline[i] = formatTime(miner[i].currentRoundBestDeadline);

					}
					else {
						deadlinefontStyle = "i";
					}
				}
				/*let currentRoundDeadline = miner.currentRoundBestDeadline == null ? "" : formatTime(miner.currentRoundBestDeadline);*/
				let minerAddress = formatMinerName(serverResponse.explorer, miner[i].addressRS, miner[i].address, miner[i].name, g_link, g_name);
				let userAgent = escapeHtml(miner[i].userAgent == null? "Unknown" : miner[i].userAgent);
				tableBody.innerHTML += "<tr><td>"+ (i+1) + ". " + minerAddress+"</td>"
				  +"<td><"+deadlinefontStyle+">"+currentRoundDeadline[i]+"</"+deadlinefontStyle+"></td>"
				  +"<td>"+miner[i].pendingBalance+"</td>"
				  +"<td>"+formatCapacity(miner[i].totalCapacity)+"</td>"
				  +"<td>"+formatCapacity(miner[i].sharedCapacity)+"</td>"
				  +"<td>"+formatCapacity(miner[i].boostedTotalCapacity)+"</td>"
				  +"<td>"+formatCapacity(miner[i].boostedSharedCapacity)+"</td>"
				  +"<td>"+parseFloat(miner[i].committedBalance).toFixed(3).replace(/(?!^)(?=(?:\d{3})+(?:\.))/gm, '\'')+"</br> BURST</td>"
				  +"<td>"+miner[i].averageCommitment.toFixed(3).replace(/(?!^)(?=(?:\d{3})+(?:\.))/gm, '\'')+"</br> BURST/TiB</td>"
				  +"<td>"+miner[i].commitmentRatio.toFixed(3)+"</td>"
				  +"<td>"+miner[i].averageCommitmentFactor.toFixed(3)+"</td>"
				  +"<td>"+miner[i].sharePercent+" %</td>"
				  +"<td>"+miner[i].donationPercent+" %</td>"
				  +"<td>"+miner[i].nConf+" / " + maxSubmissions+"</td>"
				  +"<td>"+(parseFloat(miner[i].share)*100).toFixed(3)+" %</td>"
				  +"<td>"+userAgent+"</td>"
				  +"</tr>";
			}
			poolCommitment = (serverResponse.poolTotalCapacity > 1) ? (serverResponse.poolCommittedBalance/serverResponse.poolTotalCapacity) : serverResponse.poolCommittedBalance;
			document.getElementById("minerCount").innerText = serverResponse.miners.length;
			document.getElementById("poolTotalCapacity").innerText = formatCapacity(serverResponse.poolTotalCapacity);
			document.getElementById("poolSharedCapacity").innerText = formatCapacity(serverResponse.poolSharedCapacity);
			document.getElementById("poolEffectiveTotalCapacity").innerText = formatCapacity(serverResponse.poolEffectiveTotalCapacity);
			document.getElementById("poolEffectiveSharedCapacity").innerText = formatCapacity(serverResponse.poolEffectiveSharedCapacity);
			document.getElementById("poolCommittedBalance").innerText = serverResponse.poolCommittedBalance.toFixed(3).replace(/(?!^)(?=(?:\d{3})+(?:\.))/gm, '\'') + ' BURST';
			document.getElementById("poolCommitment").innerText = poolCommitment.toFixed(3).replace(/(?!^)(?=(?:\d{3})+(?:\.))/gm, '\'') + ' BURST/TiB';
			document.getElementById("poolBoost").innerText = (serverResponse.poolEffectiveTotalCapacity/serverResponse.poolTotalCapacity).toFixed(3);
			document.getElementById("poolCommitmentRatio").innerText = (poolCommitment/averageCommitmentNQT).toFixed(3);
		break;

		case 1:
			tableHead.innerHTML = "<tr> <th><p><button onclick=\"changeTable()\" style=\"border: 1px solid #dee2e6;\">Change Table View</button></p>Miner</th>"
			+"<th>Current Deadline</th>"
			+"<th>Pending Balance</th>"
			+"<th>Total Capacity</th>"
			+"<th>Shared Capacity</th>"
			+"<th>Eff. Total Capacity</th>"
			+"<th>Eff. Shared Capacity</th>"
			+"<th>Committed Balance</th>"
			+"<th>Current Commitment</th>"
			+"<th>Commitment Ratio</th>"
			+"<th>Current Boost</th>"
			+"<th>Share Model</th>"
			+"<th>Donation Percent</th>"
			+"<th>Confirmed Deadlines</th>"
			+"<th>Pool Share</th>"
			+"<th>Software</th> </tr>";

			tableBody.innerHTML = "";
			for (let i = 0; i < serverResponse.miners.length; i++) {
				let deadlinefontStyle = "text";

				if(currentRoundDeadline[i] == "Loading...") {

					deadlinefontStyle = "text";

					if(miner[i].currentRoundBestDeadline != null) {
						currentRoundDeadline[i] = formatTime(miner[i].currentRoundBestDeadline);
					}

				}
				else {

					if(miner[i].currentRoundBestDeadline != null) {

						deadlinefontStyle = "text";

						currentRoundDeadline[i] = formatTime(miner[i].currentRoundBestDeadline);

					}
					else {
						deadlinefontStyle = "i";
					}
				}
				/*let currentRoundDeadline = miner.currentRoundBestDeadline == null ? "" : formatTime(miner.currentRoundBestDeadline);*/
				let minerAddress = formatMinerName(serverResponse.explorer, miner[i].addressRS, miner[i].address, miner[i].name, g_link, g_name);
				let userAgent = escapeHtml(miner[i].userAgent == null? "Unknown" : miner[i].userAgent);
				tableBody.innerHTML += "<tr><td>"+ (i+1) + ". " + minerAddress+"</td>"
				 +"<td><"+deadlinefontStyle+">"+currentRoundDeadline[i]+"</"+deadlinefontStyle+"></td>"
				  +"<td>"+miner[i].pendingBalance+"</td>"
				  +"<td>"+formatCapacity(miner[i].totalCapacity)+"</td>"
				  +"<td>"+formatCapacity(miner[i].sharedCapacity)+"</td>"
				  +"<td>"+formatCapacity(miner[i].effectiveTotalCapacity)+"</td>"
				  +"<td>"+formatCapacity(miner[i].effectiveSharedCapacity)+"</td>"
				  +"<td>"+parseFloat(miner[i].committedBalance).toFixed(3).replace(/(?!^)(?=(?:\d{3})+(?:\.))/gm, '\'')+"</br> BURST</td>"
				  +"<td>"+miner[i].commitment.toFixed(3).replace(/(?!^)(?=(?:\d{3})+(?:\.))/gm, '\'')+"</br> BURST/TiB</td>"
				  +"<td>"+miner[i].commitmentRatio.toFixed(3)+"</td>"
				  +"<td>"+miner[i].commitmentFactor.toFixed(3)+"</td>"
				  +"<td>"+miner[i].sharePercent+" %</td>"
				  +"<td>"+miner[i].donationPercent+" %</td>"
				  +"<td>"+miner[i].nConf+" / " + maxSubmissions+"</td>"
				  +"<td>"+(parseFloat(miner[i].share)*100).toFixed(3)+" %</td>"
				  +"<td>"+userAgent+"</td>"
				  +"</tr>";
			}
			poolCommitment = (serverResponse.poolTotalCapacity > 1) ? (serverResponse.poolCommittedBalance/serverResponse.poolTotalCapacity) : serverResponse.poolCommittedBalance;
			document.getElementById("minerCount").innerText = serverResponse.miners.length;
			document.getElementById("poolTotalCapacity").innerText = formatCapacity(serverResponse.poolTotalCapacity);
			document.getElementById("poolSharedCapacity").innerText = formatCapacity(serverResponse.poolSharedCapacity);
			document.getElementById("poolEffectiveTotalCapacity").innerText = formatCapacity(serverResponse.poolEffectiveTotalCapacity);
			document.getElementById("poolEffectiveSharedCapacity").innerText = formatCapacity(serverResponse.poolEffectiveSharedCapacity);
			document.getElementById("poolCommittedBalance").innerText = serverResponse.poolCommittedBalance.toFixed(3).replace(/(?!^)(?=(?:\d{3})+(?:\.))/gm, '\'') + ' BURST';
			document.getElementById("poolCommitment").innerText = poolCommitment.toFixed(3).replace(/(?!^)(?=(?:\d{3})+(?:\.))/gm, '\'') + ' BURST/TiB';
			document.getElementById("poolBoost").innerText = (serverResponse.poolEffectiveTotalCapacity/serverResponse.poolTotalCapacity).toFixed(3);
			document.getElementById("poolCommitmentRatio").innerText = (poolCommitment/averageCommitmentNQT).toFixed(3);
		break;

		}
    }

function prepareMinerInfo(address) {
    setCookie("getMinerLastValue", address);

    let miner = null;
    miners.forEach(aMiner => {
        if (aMiner.addressRS === address || aMiner.address.toString() === address || aMiner.name === address) {
            miner = aMiner;
        }
    });

    if (miner == null) {
        minerName.innerText = minerNotFound;
        minerPending.innerText = minerNotFound;
        minerMinimumPayout.innerText = minerNotFound;
        minerSharePercent.innerText = minerNotFound;
        minerDonationPercent.innerText = minerNotFound;
        minerCapacity.innerText = minerNotFound;
        minerCommitment.innerText = minerNotFound;
        minerCommitmentRatio.innerText = minerNotFound;
        minerCommitmentFactor.innerText = minerNotFound;
        minerSharedCapacity.innerText = minerNotFound;
        minerNConf.innerText = minerNotFound;
        minerShare.innerText = minerNotFound;
        minerSoftware.innerText = minerNotFound;
        return;
    }

    let name = escapeHtml(miner.name == null ? "Not Set" : miner.name);
    let userAgent = miner.userAgent == null ? "Unknown" : miner.userAgent;

	document.getElementById("minerAddress").innerText = miner.addressRS;
	document.getElementById("minerName").innerText = name;
	document.getElementById("minerPending").innerText = miner.pendingBalance;
	document.getElementById("minerMinimumPayout").innerText = miner.minimumPayout;
	document.getElementById("minerSharePercent").innerText = parseFloat(miner.sharePercent).toFixed(2) + " %";
	document.getElementById("minerDonationPercent").innerText = parseFloat(miner.donationPercent).toFixed(2) + " %";
	document.getElementById("minerTotalCapacity").innerText = formatCapacity(miner.totalCapacity);
	document.getElementById("minerSharedCapacity").innerText = formatCapacity(miner.sharedCapacity);
	document.getElementById("minerEffectiveTotalCapacity").innerText = formatCapacity(miner.effectiveTotalCapacity);
	document.getElementById("minerEffectiveSharedCapacity").innerText = formatCapacity(miner.effectiveSharedCapacity);
	document.getElementById("minerCommittedBalance").innerText = miner.committedBalance.replace(/(?!^)(?=(?:\d{3})+(?:\.))/gm, '\'');
	document.getElementById("minerCommitment").innerText = miner.commitment.toFixed(3).replace(/(?!^)(?=(?:\d{3})+(?:\.))/gm, '\'') + ' BURST/TiB';
	document.getElementById("minerCommitmentRatio").innerText = miner.commitmentRatio.toFixed(3);
	document.getElementById("minerBoost").innerText = miner.commitmentFactor.toFixed(3);
	document.getElementById("minerNConf").innerText = miner.nConf;
	document.getElementById("minerShare").innerText = (parseFloat(miner.share)*100).toFixed(3) + " %";
	document.getElementById("minerSoftware").innerText = userAgent;

}

function formatCapacity(capacity) {
    let capacityFloat = parseFloat(capacity);
    if (capacityFloat > 1024)
      return (capacityFloat/1024).toFixed(3) + " PiB";
    return parseFloat(capacity).toFixed(3) + " TiB";
}

function onPageLoad() {

	for(var i = 0; i<size; i++) {
		currentRoundDeadline[i] = "Loading...";
	}

	getPoolInfo();
	getCurrentRound();
	getMiners();
	getTop10Miners();

    document.getElementById("addressInput").value = getCookie("getMinerLastValue");
    document.getElementById("addressInput").addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("getMinerButton").click();
        }
    });
    document.getElementById("icon").onerror = function () {
        this.style.display = "none";
    }
}

function getWonBlocks() {
    fetch("/api/getWonBlocks").then(response => {
        return response.json();
    }).then(response => {
        let wonBlocks = response.wonBlocks;
        let table = document.getElementById("wonBlocksTable");
        table.innerHTML = "<tr><th>Count</th><th>Height</th><th class=\"d-none d-sm-table-cell\">ID</th><th>Winner</th><th>Reward + Fees</th><th class=\"d-none d-sm-table-cell\">Pool Share</th></tr>";
        for (let i = 0; i < wonBlocks.length; i++) {
            let wonBlock = wonBlocks[i];
			let count = wonBlocks.length-i;
            let height = escapeHtml(wonBlock.height);
            let id = escapeHtml(wonBlock.id);
            let reward = escapeHtml(wonBlock.reward);
            let poolShare = escapeHtml(wonBlock.poolShare);
            let minerName = formatMinerName(wonBlock.explorer, wonBlock.generatorRS, wonBlock.generator, wonBlock.name, g_link, g_name);
            table.innerHTML += "<tr><td>"+count+"</td><td>"+height+"</td><td class=\"d-none d-sm-table-cell\">"+id+"</td><td>"+minerName+"</td><td>"+reward+"</td><td class=\"d-none d-sm-table-cell\">"+poolShare+"</td></tr>";
        }
    });
}

function setCookie(name, value) {
    document.cookie = name + "=" + value + ";";
}

function getCookie(name) {
    name += "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca =decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

setInterval(updateRoundElapsed, 1000);
setInterval(getCurrentRound, 60000);
setInterval(getPoolInfo, 60000);
setInterval(getMiners, 60000);
setInterval(getTop10Miners, 240000);
