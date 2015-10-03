var GuiPage_Playlist = {				
		AlbumData : null,
		
		selectedItem : 0,
		topLeftItem : 0,
		
		selectedItem2 : 0,
		
		MAXCOLUMNCOUNT : 1,
		MAXROWCOUNT : 12, //Max = 12, causes graphical jump due to large html element, couldn't find issue,
		
		startParams : [],
		
		topMenuItems : ["PlayAll","ShuffleAll","Delete"],
		playItems : ["PlayFrom_","Play_","View_","Remove_"]
}

GuiPage_Playlist.getMaxDisplay = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
}

//------------------------------------------------------------
//      Episode Functions
//------------------------------------------------------------

GuiPage_Playlist.start = function(title,url,type,playlistId) { //Type is either Audio or Video
	alert("Page Enter : GuiPage_Playlist");
	GuiHelper.setControlButtons(null,null,null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
	
	//Save Start Params
	this.startParams = [title,url,type,playlistId];
	
	//Reset Vars
	this.topLeftItem = 0;
	this.selectedItem = -1;
	this.selectedItem2 = 0;
	
	//Load Data	
	this.AlbumData = Server.getContent(url);
	if (this.AlbumData == null) { return; }
	
	if (this.AlbumData.Items.length > 0) {
		//Set PageContent
		document.getElementById("pageContent").className = "";
		document.getElementById("pageContent").innerHTML = "<div id='guiTV_Show_Title' style='font-size:22px;padding-top:20px;padding-left:20px'></div> \
			   <div id='guiTV_Show_Subtitle' style='font-size:16px;padding-top:5px;padding-left:30px'></div> \
			   <div style='margin-top:30px;margin-left:80px;'> \
			   <div id='GuiPage_Playlist_Globals' style='display:block;width:400px;text-align:center;'> \
			   <div id='PlayAll' style='display:inline-block;padding:10px;'>Play All</div> \
			   <div id='ShuffleAll' style='display:inline-block;padding:10px;'>Shuffle All</div> \
			   <div id='Delete' style='display:inline-block;padding:10px;'>Delete</div></div> \
			<div id='GuiPage_Playlist_Options' style='padding-left:20px;padding-top:10px;'></div></div>";
		document.getElementById("Counter").innerHTML = "1/" + this.topMenuItems.length;	
				
		//Set Page Title
		document.getElementById("guiTV_Show_Title").innerHTML = title;	
		document.getElementById("guiTV_Show_Subtitle").innerHTML = type + " Playlist";	
		
		//Get Page Items
		this.updateDisplayedItems();
		
		//Update Selected Item
		this.updateSelectedItems();
			
		//Set Focus for Key Events
		document.getElementById("GuiPage_Playlist").focus();
	} else {
		//No items in playlist
		//Set PageContent
		document.getElementById("pageContent").className = "";
		document.getElementById("pageContent").innerHTML = "<div id='guiTV_Show_Title' style='font-size:22px;padding-top:20px;padding-left:20px'></div> \
			   <div id='guiTV_Show_Subtitle' style='font-size:16px;padding-top:5px;padding-left:30px'></div> \
			   <div style='margin-top:30px;margin-left:80px;'> \
			   <div id='GuiPage_Playlist_Globals' style='display:block;width:400px;text-align:center;'> \
			   <div id='PlayAll' style='display:inline-block;padding:10px;'>Play All</div> \
			   <div id='ShuffleAll' style='display:inline-block;padding:10px;'>Shuffle All</div> \
			   <div id='Delete' style='display:inline-block;padding:10px;'>Delete</div></div> \
			<div id='GuiPage_Playlist_Options' style='padding-left:20px;padding-top:10px;max-height:400px;'>There are no items in this playlist</div></div>";
		document.getElementById("Counter").innerHTML = "0/0";	
				
		//Set Page Title
		document.getElementById("guiTV_Show_Title").innerHTML = title;	
		document.getElementById("guiTV_Show_Subtitle").innerHTML = type + " Playlist";	

		//Update Selected Item
		this.updateSelectedItems();
		
		//Set Focus for Key Events
		document.getElementById("GuiPage_Playlist").focus();	
	}
};

GuiPage_Playlist.updateDisplayedItems = function() {
	var htmlToAdd = "";
	if (this.startParams[2] == "Audio") {
		htmlToAdd = "<table><th style='width:100px'></th><th style='width:33px'></th><th style='width:36px'></th><th style='width:60px'></th><th style='width:33px'></th><th style='width:250px'></th><th style='width:65px'></th>";
		for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.AlbumData.Items.length); index++){			
			if (this.AlbumData.Items[index].ParentIndexNumber === undefined || this.AlbumData.Items[index].IndexNumber === undefined) {
				TrackDetails = "?";
			} else {
				TrackDetails = this.AlbumData.Items[index].ParentIndexNumber+"." + this.AlbumData.Items[index].IndexNumber;
			}
		
			htmlToAdd += "<tr><td id=PlayFrom_"+this.AlbumData.Items[index].Id+" class='musicTableTd'>Play From Here</td><td id=Play_"+this.AlbumData.Items[index].Id+" class='musicTableTd'>Play</td><td id=View_"+this.AlbumData.Items[index].Id+" class='musicTableTd'>View</td><td id=Remove_"+this.AlbumData.Items[index].Id+" class='musicTableTd'>Remove</td>" +
					"<td class='musicTableTd'>"+TrackDetails+ "</td><td id="+ this.AlbumData.Items[index].Id +" class='musicTableTd'>" + this.AlbumData.Items[index].Name + "</td>" +
							"<td class='musicTableTd'>"+Support.convertTicksToTimeSingle(this.AlbumData.Items[index].RunTimeTicks/10000,true)+"</td></tr>";	
		}
	} else {
		htmlToAdd = "<table><th style='width:100px'></th><th style='width:33px'></th><th style='width:36px'></th><th style='width:60px'></th><th style='width:150px'></th><th style='width:50px'></th><th style='width:250px'></th><th style='width:65px'></th>";
		for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.AlbumData.Items.length); index++){	
			
			if (this.AlbumData.Items[index].Type == "Episode") {
				var epNo = Support.getNameFormat(null,this.AlbumData.Items[index].ParentIndexNumber,null,this.AlbumData.Items[index].IndexNumber);
				var seriesName = (this.AlbumData.Items[index].SeriesName !== undefined)? this.AlbumData.Items[index].SeriesName : "Unknown";
				
				htmlToAdd += "<tr><td id=PlayFrom_"+this.AlbumData.Items[index].Id+" class='musicTableTd'>Play From Here</td><td id=Play_"+this.AlbumData.Items[index].Id+" class='musicTableTd'>Play</td><td id=View_"+this.AlbumData.Items[index].Id+" class='musicTableTd'>View</td><td id=Remove_"+this.AlbumData.Items[index].Id+" class='musicTableTd'>Remove</td>" +
						"<td id="+ this.AlbumData.Items[index].Id +" class='musicTableTd'>" + seriesName + "</td><td id=epNo_"+ this.AlbumData.Items[index].Id +" class='musicTableTd'>" + epNo + "</td><td id=epName_"+ this.AlbumData.Items[index].Id +" class='musicTableTd'>" + this.AlbumData.Items[index].Name + "</td>" +
								"<td class='musicTableTd'>"+Support.convertTicksToTimeSingle(this.AlbumData.Items[index].RunTimeTicks/10000,true)+"</td></tr>";		
			} else {		
				htmlToAdd += "<tr><td id=PlayFrom_"+this.AlbumData.Items[index].Id+" class='musicTableTd'>Play From Here</td><td id=Play_"+this.AlbumData.Items[index].Id+" class='musicTableTd'>Play</td><td id=View_"+this.AlbumData.Items[index].Id+" class='musicTableTd'>View</td><td id=Remove_"+this.AlbumData.Items[index].Id+" class='musicTableTd'>Remove</td>" +
						"<td id="+ this.AlbumData.Items[index].Id +" class='musicTableTd'colspan=3 >" + this.AlbumData.Items[index].Name + "</td>" +
								"<td class='musicTableTd'>"+Support.convertTicksToTimeSingle(this.AlbumData.Items[index].RunTimeTicks/10000,true)+"</td></tr>";		
			}
		}
	}
	document.getElementById("GuiPage_Playlist_Options").innerHTML = htmlToAdd + "</table>";
}

//Function sets CSS Properties so show which user is selected
GuiPage_Playlist.updateSelectedItems = function () {
	if (this.selectedItem == -1) {	
		//Sets Correct Item To Red
		for (var index = 0; index < this.topMenuItems.length; index++) {
			if (index == this.selectedItem2) {
				document.getElementById(this.topMenuItems[index]).className = "#27a436";
			} else {
				document.getElementById(this.topMenuItems[index]).className = "";
			}
		}		
	} else {
		//Resets original Item to White
		for (var index = 0; index < this.topMenuItems.length; index++) {
			document.getElementById(this.topMenuItems[index]).className = "";
		}
		
		//Finds correct items to set Red / Green
		for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.AlbumData.Items.length); index++){	
			if (index == this.selectedItem) {
				document.getElementById(this.AlbumData.Items[index].Id).style.color = "green";
				for (var index2 = 0; index2 < this.playItems.length; index2++) {
					if (index2 == this.selectedItem2) {
						document.getElementById(this.playItems[index2]+this.AlbumData.Items[index].Id).className = "musicTableTd red";
					} else {
						document.getElementById(this.playItems[index2]+this.AlbumData.Items[index].Id).className = "musicTableTd";
					}
				}
			} else {
				document.getElementById(this.AlbumData.Items[index].Id).style.color = "white";
				for (var index2 = 0; index2 < this.playItems.length; index2++) {
					document.getElementById(this.playItems[index2]+this.AlbumData.Items[index].Id).className = "musicTableTd";
				}
			}
		}
	}
	
	//Set Counter to be album count or x/3 for top part
	if (this.selectedItem == -1) {
		document.getElementById("Counter").innerHTML = (this.selectedItem2 + 1) + "/" + this.topMenuItems.length;
	} else {
		document.getElementById("Counter").innerHTML = (this.selectedItem + 1) + "/" + this.AlbumData.Items.length;
	}
	
}

GuiPage_Playlist.keyDown = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);
	
	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	//Update Screensaver Timer
	Support.screensaver();
	
	//If screensaver is running 
	if (Main.getIsScreensaverRunning()) {
		//Update Main.js isScreensaverRunning - Sets to True
		Main.setIsScreensaverRunning();
		
		//End Screensaver
		GuiImagePlayer_Screensaver.stopScreensaver();
		
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}

	switch(keyCode) {	
		case tvKey.KEY_LEFT:
			this.processLeftKey();
			break;
		case tvKey.KEY_RIGHT:
			this.processRightKey();
			break;	
		case tvKey.KEY_UP:
			if (this.AlbumData.Items.length > 0) {
				this.processUpKey();
			}
		break;
		case tvKey.KEY_DOWN:
			if (this.AlbumData.Items.length > 0) {
				this.processDownKey();
			}
			break;
		case tvKey.KEY_RETURN:
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			Support.processReturnURLHistory();
			break;	
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
			this.processSelectedItem();
			break;	
		case tvKey.KEY_TOOLS:
		case tvKey.KEY_MENU:
			widgetAPI.blockNavigation(event);
			this.handleReturn();
			break;	
		case tvKey.KEY_INFO:
			alert ("INFO KEY");
			GuiHelper.toggleHelp("GuiPage_Playlist");
			break;
		case tvKey.KEY_YELLOW:	
			//Favourites - May not be needed on this page
			break;			
		case tvKey.KEY_BLUE:	
			GuiMusicPlayer.showMusicPlayer("GuiPage_Playlist");
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent();
			break;
	}
}

GuiPage_Playlist.handleReturn = function() {
	Support.updateURLHistory("GuiPage_Playlist",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,true);
	
	if (this.selectedItem == -1) {
		for (var index = 0; index<this.playItems.length;index++) {
			document.getElementById(this.topMenuItems[index]).className = "";
		}
		this.selectedItem2 = 0;
		GuiMainMenu.requested("GuiPage_Playlist",this.topMenuItems[0],"#27a436");
	} else {
		for (var index = 0; index<this.playItems.length;index++) {
			document.getElementById(this.playItems[index]+this.AlbumData.Items[this.selectedItem].Id).className = "musicTableTd";
		}
		this.selectedItem2 = 0;
		GuiMainMenu.requested("GuiPage_Playlist","Play_"+this.AlbumData.Items[this.selectedItem].Id,"musicTableTd red");
	}
}

GuiPage_Playlist.processUpKey = function() {
	this.selectedItem--;
	if (this.selectedItem < -1) {
		this.selectedItem = -1;
	} else {
		if (this.selectedItem == -1 && this.selectedItem2 >= 3) {
			this.selectedItem2 = 2;
		}
		if (this.selectedItem == -1) {
			document.getElementById(this.AlbumData.Items[0].Id).style.color = "white";
			for (var index = 0; index < this.playItems.length; index++) {
				document.getElementById(this.playItems[index]+this.AlbumData.Items[0].Id).className = "musicTableTd";
			}
		}
		if (this.selectedItem < this.topLeftItem) {
			if (this.topLeftItem - this.MAXCOLUMNCOUNT < 0) {
				this.topLeftItem = 0;
			} else {
				this.topLeftItem = this.topLeftItem - this.MAXCOLUMNCOUNT;
			}
			this.updateDisplayedItems();
		}
		this.updateSelectedItems();
	}
	
}

GuiPage_Playlist.processDownKey = function() {
	this.selectedItem++;
	if (this.selectedItem == 0) {
		this.selectedItem2 = 0;
	}
	if (this.selectedItem >= this.AlbumData.Items.length) {
		this.selectedItem--;
		if (this.selectedItem >= (this.topLeftItem  + this.getMaxDisplay())) {
			this.topLeftItem = this.topLeftItem + this.getMaxDisplay();
			this.updateDisplayedItems();
		}
	} else {
		if (this.selectedItem >= (this.topLeftItem + this.getMaxDisplay())) {
			this.topLeftItem++;
			this.updateDisplayedItems();
		}
	}
	this.updateSelectedItems();
}

GuiPage_Playlist.processLeftKey = function() {
	this.selectedItem2--;
	if (this.selectedItem2 < 0) {
		this.selectedItem2++;
	} else {
		this.updateSelectedItems();
	}
}

GuiPage_Playlist.processRightKey = function() {
	this.selectedItem2++;
	if (this.selectedItem == -1) {
		if (this.selectedItem2 > this.topMenuItems.length-1) {
			this.selectedItem2--;
		} else {
			this.updateSelectedItems();
		}
	} else {
		if (this.selectedItem2 > this.playItems.length-1) {
			this.selectedItem2--;
		} else {
			this.updateSelectedItems();
		}
	}
}

GuiPage_Playlist.processSelectedItem = function() {
	if (this.selectedItem == -1) {
		//Is Top Menu Bar
		switch (this.selectedItem2) {
		case 0:	
			if (this.AlbumData.Items.length > 0) {
				var url = Server.getCustomURL("/Playlists/"+this.startParams[3]+"/Items?userId="+Server.getUserID()+"&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,MediaSources&format=json");
				if (this.startParams[2] == "Video") {
					Support.updateURLHistory("GuiPage_Playlist",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],0,0,null);
					GuiPlayer.start("PlayAll",url,0,"GuiPage_Playlist");
				} else if (this.startParams[2] == "Audio") {
					GuiMusicPlayer.start("Album",url,"GuiPage_Playlist",false);
				}				
			}		
			break;
		case 1:
			if (this.AlbumData.Items.length > 0) {
				var url = Server.getCustomURL("/Playlists/"+this.startParams[3]+"/Items?userId="+Server.getUserID()+"&SortBy=Random&SortOrder=Ascending&fields=ParentId,SortName,MediaSources&format=json");
				if (this.startParams[2] == "Video") {
					Support.updateURLHistory("GuiPage_Playlist",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],0,0,null);
					GuiPlayer.start("PlayAll",url,0,"GuiPage_Playlist");
				} else if (this.startParams[2] == "Audio") {
					GuiMusicPlayer.start("Album",url,"GuiPage_Playlist",false);
				}		
			}			
			break;
		case 2:
			var ids = "";
			for(var index = 0; index < this.AlbumData.Items.length; index++) {
				alert (this.AlbumData.Items[index].PlaylistItemId);
				ids += this.AlbumData.Items[index].PlaylistItemId + ",";
			}
			ids = ids.substring(0, ids.length-1);
			
			//Remove all items from playlist
			Server.removeFromPlaylist(this.startParams[3],ids);
			Server.deletePlaylist(this.startParams[3]);
			
			//Remove latest history to stop issues
			Support.removeLatestURL();
			
			//Load Playlist Page			
			var url = Server.getItemTypeURL("SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Playlist&Recursive=true&Fields=SortName");	
			GuiDisplayOneItem.start("Playlists",url,0,0);
			break;	
		}
	} else {
		switch (this.selectedItem2) {
		case 0:
			var url = Server.getCustomURL("/Playlists/"+this.startParams[3]+"/Items?userId="+Server.getUserID()+"&StartIndex="+this.selectedItem+"&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,MediaSources&format=json");
			if (this.startParams[2] == "Video") {
				Support.updateURLHistory("GuiPage_Playlist",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],0,0,null);
				GuiPlayer.start("PlayAll",url,0,"GuiPage_Playlist");
			} else if (this.startParams[2] == "Audio") {
				GuiMusicPlayer.start("Album",url,"GuiPage_Playlist",false);
			}	
			break;
		case 1:
			var url = Server.getItemInfoURL(this.AlbumData.Items[this.selectedItem].Id);
			if (this.startParams[2] == "Video") {
				Support.updateURLHistory("GuiPage_Playlist",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],this.selectedItem,this.topLeftItem,null);
				GuiPlayer.start("PLAY",url,0,"GuiPage_Playlist");
			} else if (this.startParams[2] == "Audio"){
				GuiMusicPlayer.start("Song",url,"GuiPage_Playlist",false);
			}

			break;
		case 2:
			Support.updateURLHistory("GuiPage_Playlist",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],this.selectedItem,this.topLeftItem,null);
			if (this.startParams[2] == "Video") {
				var url = Server.getItemInfoURL(this.AlbumData.Items[this.selectedItem].Id);
				GuiPage_ItemDetails.start(this.AlbumData.Items[this.selectedItem].Name,url,0);
			} else if (this.startParams[2] == "Audio"){
				var url = Server.getChildItemsURL(this.AlbumData.Items[this.selectedItem].AlbumId,"&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Audio&Recursive=true&CollapseBoxSetItems=false");
				alert (url);
				GuiPage_Music.start(this.AlbumData.Items[this.selectedItem].Name,url,"MusicAlbum");
			}
			
			break;
		case 3:
			Server.removeFromPlaylist(this.startParams[3],this.AlbumData.Items[this.selectedItem].PlaylistItemId);
			//Timeout required to allow for action on the server!
			setTimeout(function(){
				GuiPage_Playlist.start(GuiPage_Playlist.startParams[0],GuiPage_Playlist.startParams[1],GuiPage_Playlist.startParams[2],GuiPage_Playlist.startParams[3]);
				},250);
			break;	
		}
	}
}