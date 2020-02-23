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
  $(window).resize(function() {
    $(document.body).width(window.innerWidth);
    $(document.body).height(window.innerHeight);
  });

  let menuActive = false;

  $(".tedit").mousedown(function() {
    $(this).addClass("window-active");
    $(".macosterm").removeClass("window-active");
  });
  $(".macosterm").mousedown(function() {
    $(this).addClass("window-active");
    $(".tedit").removeClass("window-active");
  });

  let containArea = $(".holder").position();
  $(".tedit").draggable({
    handle: "#teditbar",
    containment: [-9999, containArea.top, 9999, 9999],
    cancel: "#teditcontent",
    scroll: false
  }).resizable({
    minWidth: 480,
    minHeight: 240
  });
  $("#teditbar").removeClass("ui-draggable-handle");
  $("#teditcontent").removeClass("ui-draggable-handle");
  $(".macosterm").draggable({handle: "#shellbar", containment: [-9999, containArea.top, 9999, 9999], scroll: false});


  $(".menuitem").click(function() {
    var dataid = $(this).data("target");
    var self = $(this);
    if (menuActive === false) {
      $(".menuitem").each(function() {
        $(this).removeClass("active");
      });
      self.addClass("active");
      $(".collapse").removeClass("hidden");
      $(".submenu").each(function() {
        $(this).addClass("hidden");
      });
      $("#" + dataid).removeClass("hidden");
      $("#" + dataid).offset({ top: $("header").height(), left: self.offset().left });
      menuActive = true;
    } else {
      $(".menuitem").each(function() {
        $(this).removeClass("active");
      });
      $(".collapse").addClass("hidden");
      $(".submenu").each(function() {
        $(this).addClass("hidden");
      });
      menuActive = false;
    }
  });

  $(".submenuitem").mouseenter(function() {
    if (menuActive === true) {
      $(this).addClass("active");
    }
  });
  $(".submenuitem").mouseleave(function() {
    if (menuActive === true) {
      $(this).removeClass("active");
    }
  });

  $("header .menuitem").mouseenter(function() {
    var dataid = $(this).data("target");
    var self = $(this);
    if (menuActive === true) {
      $(".menuitem").each(function() {
        $(this).removeClass("active");
      });
      $(".submenu").each(function() {
        $(this).addClass("hidden");
      });
      $("#" + dataid).removeClass("hidden");
      $("#" + dataid).offset({ top: $("header").height(), left: self.offset().left });
      $(this).addClass("active");
    }
  });

  $(document).click(function(e) {
    if (!$(e.target).hasClass("menuitem")) {
      $(".menuitem").each(function() {
        $(this).removeClass("active");
      });
      $(".collapse").addClass("hidden");
      $(".submenu").each(function() {
        $(this).addClass("hidden");
      });
      menuActive = false;
    }
  })

});
