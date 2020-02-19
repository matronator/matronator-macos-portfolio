var d = new Date();
var day;
switch(d.getDay()) {
  case 0:
    day = "Sun";
    break;
  case 1:
    day = "Mon";
    break;
  case 2:
    day = "Tue";
    break;
  case 3:
    day = "Wed";
    break;
  case 4:
    day = "Thu";
    break;
  case 5:
    day = "Fri";
    break;
  case 6:
    day = "Sat";
    break;
}

let mins = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();

document.getElementById("date").innerHTML = day + " " + d.getHours() + ":" + mins;

$( document ).ready(function() {
  let menuActive = false;

  $(".tedit").mousedown(function() {
    $(this).addClass("window-active");
    $(".macosterm").removeClass("window-active");
  });
  $(".macosterm").mousedown(function() {
    $(this).addClass("window-active");
    $(".tedit").removeClass("window-active");
  });

  $(".tedit").draggable({
    handle: "#teditbar",
    containment: ".holder",
    cancel: "#teditcontent"
  }).resizable({
    aspectRatio: true,
    minWidth: 480
  });
  $("#teditbar").removeClass("ui-draggable-handle");
  $("#tcontent").removeClass("ui-draggable-handle");
  $(".macosterm").draggable({handle: "#shellbar", containment: ".holder"});


  $(".menuitem").click(function() {
    if (menuActive === false) {
      $(".menuitem").each(function() {
        $(this).removeClass("active");
      });
      $(this).addClass("active");
      menuActive = true;
    } else {
      $(".menuitem").each(function() {
        $(this).removeClass("active");
      });
      menuActive = false;
    }
  });

  $(".menuitem").mouseenter(function() {
    if (menuActive === true) {
      $(".menuitem").each(function() {
        $(this).removeClass("active");
      });
      $(this).addClass("active");
    }
  });

  $(document).click(function(e) {
    if (!$(e.target).hasClass("menuitem")) {
      $(".menuitem").each(function() {
        $(this).removeClass("active");
      });
      menuActive = false;
    }
  })

});
