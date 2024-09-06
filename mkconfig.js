var body;
var devtype;
var config;
var newconf;

var g_config_name;

let var_errors=0;

var g_readonly = true;

let prefix2mask=[
"0.0.0.0",
"128.0.0.0",
"192.0.0.0",
"224.0.0.0",
"240.0.0.0",
"248.0.0.0",
"252.0.0.0",
"254.0.0.0",
"255.0.0.0",
"255.128.0.0",
"255.192.0.0",
"255.224.0.0",
"255.240.0.0",
"255.248.0.0",
"255.252.0.0",
"255.254.0.0",
"255.255.0.0",
"255.255.128.0",
"255.255.192.0",
"255.255.224.0",
"255.255.240.0",
"255.255.248.0",
"255.255.252.0",
"255.255.254.0",
"255.255.255.0",
"255.255.255.128",
"255.255.255.192",
"255.255.255.224",
"255.255.255.240",
"255.255.255.248",
"255.255.255.252",
"255.255.255.254",
"255.255.255.255"
];

let prefix2wildcard=[
"255.255.255.255",
"127.255.255.255",
"63.255.255.255",
"31.255.255.255",
"15.255.255.255",
"7.255.255.255",
"3.255.255.255",
"1.255.255.255",
"0.255.255.255",
"0.127.255.255",
"0.63.255.255",
"0.31.255.255",
"0.15.255.255",
"0.7.255.255",
"0.3.255.255",
"0.1.255.255",
"0.0.255.255",
"0.0.127.255",
"0.0.63.255",
"0.0.31.255",
"0.0.15.255",
"0.0.7.255",
"0.0.3.255",
"0.0.1.255",
"0.0.0.255",
"0.0.0.127",
"0.0.0.63",
"0.0.0.31",
"0.0.0.15",
"0.0.0.7",
"0.0.0.3",
"0.0.0.1",
"0.0.0.0"
];

let ip_reg=new RegExp('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');

var subid=1;

function keys(obj) {
  var keys = [];

  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      keys.push(key);
    };
  };

  return keys;
};

function del_label() {
  return $(LABEL)
        .addClass("ns")
        .css("padding-left", "1em")
        .css("cursor", "default")
        .css("font-weight", "bold")
        .css("color", "#800000")
        .html("&#10060;")
  ;
};

function add_label() {
  return $(LABEL)
        .addClass("ns")
        .css("padding-left", "1em")
        .css("cursor", "default")
        .css("font-weight", "bold")
        .css("color", "#008000")
        .html("&#10010;")
  ;
};

function copy_label() {
  return $(LABEL)
        .addClass("ns")
        .css("padding-left", "1em")
        .css("cursor", "default")
        .css("font-weight", "bold")
        .css("color", "#000080")
        .html("&#x2398;")
  ;
};

function handle_label() {
  return $(LABEL)
        .addClass("ns")
        .addClass("handle")
        .css("cursor", "move")
        .css("font-weight", "bold")
        .html("&#9776;")
  ;
};

function template_add_int_role(template, i, before) {
  var filter=config["templates"][template]["interfaces"][i]["devfilter"];
  var prefix=config["templates"][template]["interfaces"][i]["prefix"];
  var list=config["templates"][template]["interfaces"][i]["list"];
  var role=config["templates"][template]["interfaces"][i]["role"];

  $(DIV)
   .css("display", "table-row")
   .addClass("sort")
   .addClass("templateintrow")
   .prop("data-row-index", i)
   .append(
     $(DIV)
      .css("display", "table-cell")
      .append(
        handle_label()
      )
   )
   .append(
     $(DIV)
      .addClass("devfilter")
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .text(filter)
   )
   .append(
     $(DIV)
      .addClass("prefix")
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .text(prefix)
   )
   .append(
     $(DIV)
      .addClass("list")
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .text(list)
   )
   .append(
     $(DIV)
      .addClass("role")
      .prop("data-role", role)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .text(role)
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .append(
        del_label()
         .click( function() {
           var template=$(this).parents(".templaterow").prop("data-template");
           var row=$(this).parents(".templateintrow");

           var filter=row.find(".devfilter").text();
           var prefix=row.find(".prefix").text();
           var list=row.find(".list").text();
           var role=row.find(".role").text();

           var newintrow=$(this).parents(".templateinttable").find(".templatenewintrow");
           var newinputs=newintrow.find("input");
           var newsel=newintrow.find("select");

           $(newinputs[0]).val(filter);
           $(newinputs[1]).val(prefix);
           $(newinputs[2]).val(list);
           newsel.val(role);

           row.siblings().css("background-color", "initial");

           var table=$(this).parents(".templateinttable");
           var index=row.prop("data-row-index");

           config["templates"][template]["interfaces"].splice(index, 1);

           row.remove();

           var rows=table.find(".templateintrow");
           for(var i=0; i < rows.length; i++) {
             $(rows[i]).prop("data-row-index", i);
           };

           config_changed(1);
         })
      )
      .append(
        copy_label()
         .click( function() {
           var row=$(this).parents(".templateintrow");

           var filter=row.find(".devfilter").text();
           var prefix=row.find(".prefix").text();
           var list=row.find(".list").text();
           var role=row.find(".role").text();

           var newintrow=$(this).parents(".templateinttable").find(".templatenewintrow");
           var newinputs=newintrow.find("input");
           var newsel=newintrow.find("select");

           $(newinputs[0]).val(filter);
           $(newinputs[1]).val(prefix);
           $(newinputs[2]).val(list);
           newsel.val(role);

         })
      )
   )
   .insertBefore( before )
  ;

};

function template_feature_remove_add_check(feature) {
  return config["features"] != undefined && config["features"][feature] != undefined;
};

function template_features_change( elm ) {
  var template=elm.parents(".templaterow").prop("data-template");
  var flist=elm.parents(".templaterow").find(".templatefeatureslist").find(".key");
  var featureslist=[];

  for(var i=0; i < flist.length; i++) {
    featureslist.push( $(flist[i]).text() );
  };
  config["templates"][template]["global_features"] = featureslist;
  config_changed(1);
};

function template_add_var(varname, template, table) {
  if(config["templates"][template] != undefined && config["templates"][template]["variables"][varname] != undefined) {
    var row=$(DIV)
     .addClass("templatevarrow")
     .prop("data-varname", varname)
     .css("display", "table-row")
     .append(
       $(DIV)
        .css("display", "table-cell")
        .append(
          $(INPUT, {readonly: true})
           .addClass("templatevarname")
           .css("background-color", "#EEEEEE")
           .val(varname)
        )
     )
     .append(
       $(DIV)
        .css("display", "table-cell")
        .css("padding-left", "1em")
        .append(
          $(INPUT)
           .val(config["templates"][template]["variables"][varname])
           .css("width", "400px")
           .on("input", function() {
             var template=$(this).parents(".templaterow").prop("data-template");
             var vn=$(this).parents(".templatevarrow").prop("data-varname");
             config["templates"][template]["variables"][vn]=$(this).val();
             config_changed(1);
           })
        )
     )
     .append(
       $(DIV)
        .css("display", "table-cell")
        .css("padding-left", "1em")
        .append(
          del_label()
           .click(function() {

             var varname=$(this).parents(".templatevarrow").prop("data-varname");
             var template=$(this).parents(".templaterow").prop("data-template");

             if(config["variables"][varname] != undefined) {

               var varvalue=config["templates"][template]["variables"][varname];

               var addvarsel=$(this).parents(".templatevars").find(".templatenewvarsel");
               var addvarval=$(this).parents(".templatevars").find(".templatenewvarval");

               var opts=addvarsel.find("option").filter(function() { return $(this).val() == varname; });
               if(opts.length == 0) {
                 addvarsel.append( $("<OPTION/>", { value: varname}).text(varname) );
               };
               addvarsel.val(varname);
               addvarval.val(varvalue);
             };

             $(this).parents(".templatevarrow").remove();

             delete config["templates"][template]["variables"][varname];

             config_changed(1);
           })
        )
     )
    ;
    if( table.find(".templatenewvarrow").length > 0) {
      row.insertBefore( table.find(".templatenewvarrow") );
    } else {
      row.appendTo( table );
    };
  };
};

function templates_edited() {
  var templatesvarrows=$("#te").find(".templatevarrow");

  for(var tvri=0; tvri < templatesvarrows.length; tvri++) {
    var varnameelm=$(templatesvarrows[tvri]).find("input")[0];
    var varname=$(varnameelm).val();
    if(varname == undefined || config["variables"][varname] == undefined) {
      $(templatesvarrows[tvri]).css("background-color", "#FFBBBB");
    } else {
      $(templatesvarrows[tvri]).css("background-color", "initial");
    };
  };
  config_changed(1);
};

function tedelvar() {
  var varinputs=$(this).parent().siblings().find("input");
  if(varinputs.length == 0) return;
  var varnameelm=varinputs[0];


  var varname=$(varnameelm).val();
  if(confirm("Подтвердите удаление переменной \""+varname+"\"")) {

    var tevars=$("#tevars");
    var newvarrow=tevars.find(".tenewvarrow");
    var newvarinputs=newvarrow.find("input");

    if(newvarinputs.length > 0) {
      $(newvarinputs[0]).val( $(varinputs[0]).val() );
      $(newvarinputs[1]).val( $(varinputs[1]).val() );
      $(newvarinputs[2]).val( $(varinputs[2]).val() );
      $(newvarinputs[3]).val( $(varinputs[3]).val() );
    };

    delete config["variables"][varname];
    $(varnameelm).parent().parent().remove();
    config_changed(1);
    templates_edited();
    tevalidatevars();

    $("#te").find(".templatenewvarsel option[value="+varname+"]").remove();
  };
};

function teaddnewvar() {
  if(tevalidatevars() != 0) {
    return;
  };

  var tevars=$("#tevars");

  var newvarrow=tevars.find(".tenewvarrow");
  var newvarinputs=newvarrow.find("input");

  var newvarname=$( newvarinputs[0] ).val();
  var newvarlabel=$( newvarinputs[1] ).val();
  var newvarcheck=$( newvarinputs[2] ).val();

  config["variables"][newvarname]={};
  config["variables"][newvarname]["name"]=newvarlabel;
  config["variables"][newvarname]["order"]=999999999;
  config["variables"][newvarname]["check"]=newvarcheck;

  var newrow=$(DIV)
   .addClass("tevarrow")
   .css("display", "table-row")
   .data("varname", newvarname)
   .append(
     $(DIV)
      .css("display", "table-cell")
      .append(handle_label())
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .append(
        $(INPUT, { readonly: true, value: newvarname })
         .css("background-color", "#EEEEEE")
         .on("input", function(){tevalidatevars();})
      )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .append(
        $(INPUT, { value: config["variables"][newvarname]["name"] })
         .on("input", function(){tevalidatevars();})
      )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .append(
        $(INPUT, { value: config["variables"][newvarname]["check"] })
         .on("input", function(){tevalidatevars();})
         .css("width", "600px")
      )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .append(
        del_label()
         .click( tedelvar )
       )
   )
  ;
  newvarrow.before(newrow);

  $( newvarinputs[0] ).val("");
  $( newvarinputs[1] ).val("");
  $( newvarinputs[2] ).val("");
  $( newvarinputs[3] ).val("");

  
  var tevarsdivs=$("#te").find(".templatevars");

  for(var i=0; i < tevarsdivs.length; i++) {
    var varsearch=$( tevarsdivs[i] ).find(".templatevarname").filter(function() { return $(this).val() == newvarname });
    if(varsearch.length == 0) {

      $( tevarsdivs[i] ).find(".templatenewvarsel")
       .append( $("<OPTION/>", {value: newvarname}).text(newvarname) );
    };
  };

  $("#tevars").trigger("sortstop");
};

function tevalidatevars() {
  $("#temessage").text("");
  var tevars=$("#tevars");
  var terows=tevars.find(".tevarrow");
  terows.css("background-color", "initial");
  terows.children().css("background-color", "initial");
  var vars={};

  var errors=0;

  for(var vi=0; vi < terows.length; vi++) {
    var fields=$(terows[vi]).find("input");
    var varname=$(fields[0]).val();
    if(vars[varname] != undefined || ! /^[a-zA-Z0-9_\-]+$/.test(varname) ) {
      $(terows[vi]).css("background-color", "#FFEEEE");
      $(fields[0]).parent().css("background-color", "#FFBBBB");
      errors++;
    };

    var varlabel=$(fields[1]).val();
    if(/^\s*$/.test(varlabel)) {
      $(terows[vi]).css("background-color", "#FFEEEE");
      $(fields[1]).parent().css("background-color", "#FFBBBB");
      errors++;
    };

    var varcheck=$(fields[2]).val();
    try {
      var re=new RegExp(varcheck);
    } catch(e) {
      $(terows[vi]).css("background-color", "#FFEEEE");
      $(fields[3]).parent().css("background-color", "#FFBBBB");
      errors++;
    };

    vars[varname]={};
    vars[varname]["name"] = varlabel;
    vars[varname]["check"] = varcheck;
  };

  if(!errors) {
    config["variables"]=vars;
  };

  var newvarrow=tevars.find(".tenewvarrow");
  var newvarinputs=newvarrow.find("input");

  var newvarname=$( newvarinputs[0] ).val();
  var newvarlabel=$( newvarinputs[1] ).val();
  var newvarcheck=$( newvarinputs[2] ).val();

  newvarrow.css("background-color", "initial");
  newvarrow.children().css("background-color", "initial");

  if(newvarname != "" || newvarlabel != "" || newvarcheck != "") {

    if(vars[newvarname] != undefined || ! /^[a-zA-Z0-9_\-]+$/.test(newvarname) ) {
      newvarrow.css("background-color", "#FFEEEE");
      $( newvarinputs[0] ).parent().css("background-color", "#FFBBBB");
      errors++;
    };

    if(/^\s*$/.test(newvarlabel)) {
      newvarrow.css("background-color", "#FFEEEE");
      $( newvarinputs[1] ).parent().css("background-color", "#FFBBBB");
      errors++;
    };

    try {
      var re=new RegExp(newvarcheck);
    } catch(e) {
      newvarrow.css("background-color", "#FFEEEE");
      $( newvarinputs[3] ).parent().css("background-color", "#FFBBBB");
      errors++;
    };

  } else {
    errors++;
  };

  config_changed(1);

  return errors;
};

function config_changed(autosave) {

  var conf_str=JSON.stringify( config, undefined, 2 );
  $("#configtext")
   .text( conf_str )
  ;

  if(autosave == 1) {
    $("#autosave_ind").css("color", "yellow");
  };

  if( autosave == 1 && $("#autosave").is(":checked") && !g_readonly ) {
    run_query({"action": "save_config", "name": g_config_name, "config": conf_str}, function(res) {
      $("#autosave_ind").css("color", "green");
      after_save();
    });
  } else {
    after_save();
  };
};


function after_save() {

  $("#message").text("");

  var body=$("#configarea");

  body.empty();

  if(config["devtypes"].length < 1) {
    $("#message").text("No device types available!")
    return;
  };

  if(config["templates"] == undefined) {
    $("#message").text("No templates in config!");
    return;
  };

  if(keys(config["templates"]).length < 1) {
    $("#message").text("No templates in config!").appendTo( body );
    return;
  };

  var type_list=$("<SELECT/>", { id: "devtype" })
   .append( $("<OPTION/>", { selected: true, value: "" }).text(" Выбрать ") )
   .change(function() {
     var type=$(this).val();
     if(type != "") {
       $("#template").find('option').remove();
       var plist=keys(config["templates"]);
       plist.sort(function(a,b) {
         var order_a=100;
         var order_b=100;
         if(config["templates"][a]["order"] != undefined) order_a=Number( config["templates"][a]["order"] );
         if(config["templates"][b]["order"] != undefined) order_b=Number( config["templates"][b]["order"] );
         return order_a - order_b;
       });
       for(var i=0; i < plist.length; i++) {
         if( config["templates"][ plist[i] ]["devfilter"] == undefined) {
           config["templates"][ plist[i] ]["devfilter"] = ".*";
         };
         var re=new RegExp( config["templates"][ plist[i] ]["devfilter"] );
         if(re.test(type)) {
           $("<OPTION/>", { selected: (plist.length == 1 || config["templates"][ plist[i] ]["default"] == 1), value: plist[i] }).text( config["templates"][ plist[i] ]["description"]).appendTo( $("#template") );
         };
       };
       template_selected();
     } else {
       template_selected();
     };;
   });

  for(var ti in config["devtypes"]) {
    var t=config["devtypes"][ti];
    type_list.append( $("<OPTION/>", { value: t }).text(t) );
  };

  var template_list=$("<SELECT/>", { id: "template" })
   .change(template_selected);

  $(DIV)
   .append(
     $(LABEL).text("Модель: ")
   )
   .append( type_list )
   .append(
     $(LABEL).text(" Шаблон: ")
   )
   .append( template_list )
   .appendTo( body );

  var left=$(DIV)
   .css("display", "inline-block")
   .css("vertical-align", "top")
   .appendTo( body );

  var right=$(DIV)
   .css("margin-top", "1em")
   .css("display", "inline-block")
   .css("vertical-align", "top")
   .css("margin-left", "1em")
   .appendTo( body );

  $(DIV, { id: "dev_options" })
   .css("margin-top", "1em")
   .css("display", "table")
   .appendTo( left );

  $(DIV, { id: "dev_variables" })
   .css("margin-top", "1em")
   .css("display", "table")
   .appendTo( left );

  $(DIV, { id: "interfaces" })
   .css("margin-top", "1em")
   .css("display", "table")
   .appendTo( left )
   ;


  $(DIV, { id: "result" })
   .css("white-space", "pre")
   .css("border", "1px black solid")
   .css("padding", "1em")
   .css("background-color", "lightgray")
   .css("overflow", "auto")
   .appendTo( right )
   .hide()
   ;
};

function tedevlistchange() {
  var dev_list=[];
  $("#tedevtypes").find(".key").each(function() {
    dev_list.push( $(this).text() );
  });

  config["devtypes"]=dev_list;

  config_changed(1);
};

function new_feature_check() {
  var fsect=$(document).find(".globalfeaturessect");
  var newgfelm=fsect.find(".newglobalfeaturename");
  var newgf=newgfelm.val().replace(/^\s+/, "").replace(/\s+$/, "");

  newgfelm.css("background-color", "initial");

  if(newgf == undefined || newgf == "") {
    return false;
  };

  if(!newgf.match(/^[a-zA-Z0-9\-_]+$/)) {
    newgfelm.css("background-color", "#FFBBBB");
    return false;
  };

  if(config["features"][newgf] != undefined) {
    newgfelm.css("background-color", "#FFBBBB");
    return false;
  };

  return true;
};

function optional_features_changed() {
  var template_rows=$(".templaterow");
  for(var ti=0; ti < template_rows.length; ti++) {
    var template=$(template_rows[ti]).prop("data-template");
    var tfl=$(template_rows[ti]).find(".templatefeatureslist").find(".keyrow");
    for(var ri=0; ri < tfl.length; ri++) {
      var feat=$(tfl[ri]).prop("data-key");
      var optional=$(tfl[ri]).find("input[name=optional]:checked").val();
      if(optional != undefined) {
        if(config["templates"][template]["optional_features"] == undefined) {
          config["templates"][template]["optional_features"] = {};
        };
        config["templates"][template]["optional_features"][feat] = optional;
      };
    };
  };

  config_changed(1);
};

function add_sortable_key(value, sortable, removetrigger, removeaddcheck, optional, opt_value) {
  $("#temessage").text("");
  if(sortable.hasClass("uniquekeys")) {
    var check=sortable.find(".key").filter(function() {
      return $(this).text() == value;
    });
    if(check.length > 0) {
      $("#temessage").text("Уникальное значение уже присутствует в списке");
      return;
    };
  };
  var row=$(DIV)
   .css("display", "table-row")
   .addClass("keyrow")
   .prop("data-key", value)
   .append(
     handle_label()
   )
   .append(
     $(SPAN)
      .addClass("key")
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .css("padding-right", "1em")
      .text(value)
   );

   if(optional != undefined) {
     row.append(
       $(DIV)
        .addClass("optional")
        .css("display", "table-cell")
        .css("padding-left", "1em")
        .css("padding-right", "1em")
.append(
  $("<FORM/>")
   .css("display", "inline")
        .append(
          $(INPUT, { type: "radio", name: "optional", value: "off", checked: (opt_value == "off") })
           .on("change", function() {
              optional();
           })
        )
        .append(
          $(INPUT, { type: "radio", name: "optional", value: "on-on", checked: (opt_value == "on-on") })
           .on("change", function() {
              optional();
           })
        )
        .append(
          $(INPUT, { type: "radio", name: "optional", value: "on-off", checked: (opt_value == "on-off") })
           .on("change", function() {
              optional();
           })
        )
     )
)
   };

   row.append(
     del_label()
      .click(function() {
        var key=$(this).siblings().filter(".key").text();
        if(confirm("Подтвердите удаление \""+key+"\"")) {
          $(this).parent().parent().parent().find(".newvalue").val(key);
          if(removeaddcheck) {
            if(removeaddcheck(key)) {
              $(this).parent().parent().parent().find(".newvaluesel").append( $("<OPTION/>", { value: key}).text(key) );
              $(this).parent().parent().parent().find(".newvaluesel").val(key);
            };
          } else {
            $(this).parent().parent().parent().find(".newvaluesel").append( $("<OPTION/>", { value: key}).text(key) );
            $(this).parent().parent().parent().find(".newvaluesel").val(key);
          };
          var sortable=$(this).parents(".sortable");
          $(this).parent().remove();
          if(removetrigger) removetrigger( sortable );
        };
      })
   )
   .appendTo(sortable);
};

function add_subsection(plus_minus, label, parent_div) {
  var subsection=$(DIV, { id: "subsection_"+subid})
   .css("margin-left", "1em")
   .css("margin-bottom", "1em")
   .toggle( plus_minus == "-");

  $(DIV)
   .append(
     $(LABEL)
      .addClass("ns")
      .text(plus_minus)
      .css("width", "1em")
      .css("display", "inline-block")
      .css("text-align", "center")
      .css("border", "1px black solid")
      .css("border-radius", "5px")
      .prop("data-subid", subid)
      .click(function() {
        var sid=$(this).prop("data-subid");
        var subsection=document.getElementById("subsection_"+sid);
        $(subsection).toggle();
        if( $(subsection).is(":visible") ) {
          $(this).text("-");
        } else {
          $(this).text("+");
        };
      })
   )
   .append( $(LABEL).addClass("ns").text(label) )
   .append( subsection )
   .appendTo( parent_div );
  subid++;
  return subsection;
};

function var_value(varname) {
  let var_elm=$("INPUT#var_value_"+varname);
  if(var_elm.length !== 1) {
    var_errors++;
    return null;
  };

  let val=var_elm.val();
  let check=var_elm.prop("data-check");
  if(check == undefined) {
    var_errors++;
    return undefined;
  };
  let check_re=new RegExp(check);
  if(!check_re.test(val)) {
    var_elm.css("background-color", "#FF8888");
    var_errors++;
    return undefined;
  } else {
    var_elm.css("background-color", "white");
  };
  return val;
};

function var_sub(line) {
  var curl_parts=line.split(/(%{(?:\([^\)}]+\))?[A-Za-z_\-0-9]+}%)/);
  var curlline="";

  for(var lpi=0; lpi < curl_parts.length; lpi++) {
    var parts=curl_parts[lpi].match(/^%{(\([^\)}]+\))?([A-Za-z_\-0-9]+)}%$/);
    let var_val=(parts != undefined && parts != null && parts[2] != undefined)?var_value(parts[2]):undefined;
    if(parts != undefined && parts != null && parts[2] != undefined && var_val === undefined) return undefined;
    if(var_val !== undefined && var_val !== null) {
      let final_val=var_val;

      if(parts[1] != undefined) {
        let opparts;
        if((opparts=parts[1].match(/^\(z(\d+)\)$/)) != null && var_val.match(/^\d+$/)) {
          let min_len=opparts[1];
          let num=Number(var_val).toString();
          while(num.length < min_len) num="0"+num;
          final_val=num;
        } else if(parts[1].match(/^\(mask\)$/) != null && var_val.match(/^\d+$/) && Number(var_val) >= 0 && Number(var_val) <= 32) {
          final_val=prefix2mask[Number(var_val)];
        } else if(parts[1].match(/^\(wildcard\)$/) != null && var_val.match(/^\d+$/) && Number(var_val) >= 0 && Number(var_val) <= 32) {
          final_val=prefix2wildcard[Number(var_val)];
        } else if((opparts=parts[1].match(/^\(net_([A-Za-z_\-0-9]+)\)$/)) != null && var_val.match(ip_reg)) {
          let prefix_len_var=opparts[1];
          let prefix_len=var_value(prefix_len_var);
          if(prefix_len === undefined) return undefined;
          if(prefix_len !== undefined && prefix_len !== null && prefix_len.match(/^\d+$/) && Number(prefix_len) >= 0 && Number(prefix_len) <= 32) {
            prefix_len_num=Number(prefix_len);
            let mask=prefix2mask[prefix_len_num];
            let mask_a=mask.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
            let ip_a=var_val.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
            let net_a=Array();
            for(let op_i=1; op_i < mask_a.length; op_i++) {
              net_a.push(Number( Number(ip_a[op_i]) & Number(mask_a[op_i])).toString());
            };
            final_val=net_a.join(".");
          } else {
            final_val=" #net_func_ERROR# ";
          };
        } else {
          final_val=" #UNKNOWN_func_ERROR# ";
        };
      };

      curlline += final_val;
    } else {
      curlline += curl_parts[lpi];
    };
  };



  var line_parts=curlline.split(/(%[A-Za-z_\-0-9]+%)/);

  var outline="";

  for(var lpi=0; lpi < line_parts.length; lpi++) {
    var parts=line_parts[lpi].match(/^%([A-Za-z_\-0-9]+)%$/);
    let varvalue=(parts != undefined && parts[1] != undefined)?var_value(parts[1]):undefined;
    if(parts != undefined && parts[1] != undefined && varvalue === undefined) return undefined;
    if(varvalue !== undefined && varvalue !== null) {
      outline += varvalue;
    } else {
      outline += line_parts[lpi];
    };
  };

  var mathline="";

  var math_parts=outline.split(/(%\([0-9*+\/\-\(\)]+\)%)/);
  for(var lpi=0; lpi < math_parts.length; lpi++) {
   var parts=math_parts[lpi].match(/^%\(([0-9*+\/\-\(\)]+)\)%$/);
    if(parts != undefined && parts[1] != undefined) {
      try {
        mathline += eval(parts[1]);
      } catch(e) {
        mathline += "MATH ERROR!";
      };
    } else {
      mathline += math_parts[lpi];
    };
  };


  return mathline;
};

function var_input () {
  var errors=0;
  $("#message").text(" ");
  $(".var_row").css("background-color", "initial");

  var template=$("#template").val();
  if(template == undefined || template == "") {
    $("#message").text("No template selected");
    return;
  };

  var devtype=$("#devtype").val();
  if(devtype == undefined || devtype == "") {
    $("#message").text("No device type selected");
    return;
  };

  $("#dev_variables").find("INPUT").css("background-color", "gray");

  var int_list=[];
  var int_role={};

  var int_sels=$("#interfaces").find("SELECT");
  for(var i=0; i < int_sels.length; i++) {
    var sel=$( int_sels[i] );
    var role=sel.val();
    if(role == undefined) {
      $("#message").text( "undefined value for interface role" );
      $("#result").text("").hide();
      return;
    };
    var int_name=sel.prop("data-int");
    if(int_name == undefined) {
      $("#message").text( "undefined interface name" );
      $("#result").text("").hide();
      return;
    };
    if(role == "") {
      $("#message").text( "Не быбрана роль для интерфейса \""+int_name+"\"");
      $("#result").text("").hide();
      return;
    };
    int_list.push(int_name);
    int_role[int_name]=role;
    if(config["roles"][role] == undefined) {
      $("#message").text( "Undefined role \"" + role + "\" for interface \""+int_name+"\"");
      $("#result").text("").hide();
      return;
    };
  };

  var res="";

  var now=new Date();

  res += "! Generated: "+now.toString()+"\n";

  var template_features=[];
  for(var i=0; i < config["templates"][template]["global_features"].length; i++) {
    feat=config["templates"][template]["global_features"][i];
    if(optional_feats[feat] == undefined || optional_feats[feat] == "on-on") {
      template_features.push(feat);
    };
  };

  if(config["templates"][template]["global_features"].indexOf("INTERFACES") < 0) {
    template_features.push("INTERFACES");
  };

  var int_post_sections={};

  for(var gfi=0; gfi < template_features.length; gfi++) {
    var gf=template_features[gfi];
    if(gf != "INTERFACES") {
      if(config["features"][gf] == undefined) {
        $("#message").text( "Глобальная функция \""+gf+"\" не определена, проверьте конфигурацию приложения");
        $("#result").text("").hide();
        return;
      };
      for(var fi=0; fi < config["features"][gf].length; fi++) {
        var devfilter=new RegExp(config["features"][gf][fi]["devfilter"]);
        if(devfilter.test(devtype)) {
          for(var li=0; li < config["features"][gf][fi]["lines"].length; li++) {
            var line=config["features"][gf][fi]["lines"][li];
            res += line+"\n";
          };
          if(config["features"][gf][fi]["stop"] != undefined) {
            break;
          };
        };
      };
    } else {
      var int_config="";

      for(var inti=0; inti < int_list.length; inti++) {
        var int_name=int_list[inti];
        var role=int_role[int_name];
        //variables["INTNAME"]=int_name;

        try {
          var test=config["roles"][role]["int_config"].length;
        } catch(e) {
          alert("boo");
          return;
        };
        for(var ri=0; ri < config["roles"][role]["int_config"].length; ri++) {
          var role_feat=config["roles"][role]["int_config"][ri]["feature"];
          var invert=config["roles"][role]["int_config"][ri]["invert"];
          var dev_re=new RegExp(config["roles"][role]["int_config"][ri]["devfilter"]);
          var feat_index = template_features.indexOf(role_feat);
          if(dev_re.test(devtype) &&
             (role_feat == undefined ||
              (feat_index >= 0 && invert !== 1) ||
              (feat_index == -1 && invert === 1)
             )
          ) {

            for(var li=0; li < config["roles"][role]["int_config"][ri]["lines"].length; li++) {
              var line=config["roles"][role]["int_config"][ri]["lines"][li];
              line=line.replace(/%INTNAME%/g, int_name);
              int_config += line+"\n";
            };
          };
        };
        if(config["roles"][role]["global_post_config"] != undefined) {
          for(var ri=0; ri < config["roles"][role]["global_post_config"].length; ri++) {
            var role_feat=config["roles"][role]["global_post_config"][ri]["feature"];
            var invert=config["roles"][role]["global_post_config"][ri]["invert"];
            var dev_re=new RegExp(config["roles"][role]["global_post_config"][ri]["devfilter"]);
            var feat_index = template_features.indexOf(role_feat);
            if(dev_re.test(devtype) &&
               (role_feat == undefined ||
                (feat_index >= 0 && invert !== 1) ||
                (feat_index == -1 && invert === 1)
               )
            ) {
    
              for(var li=0; li < config["roles"][role]["global_post_config"][ri]["lines"].length; li++) {
                var line=config["roles"][role]["global_post_config"][ri]["lines"][li];
                var section="100_GLOBAL";
                if(config["roles"][role]["global_post_config"][ri]["section"] != undefined) {
                  section=config["roles"][role]["global_post_config"][ri]["section"];
                };
                if(int_post_sections[section] == undefined) {
                  int_post_sections[section]="";
                };
                line=line.replace(/%INTNAME%/g, int_name);
                int_post_sections[section] += line+"\n";
              };
            };
          };
        };
      };
    
      res += int_config;

      res += "INTERFACES_GLOBAL_CONFIG";
    };
  };

  var res_parts=res.split(/(INTERFACES_GLOBAL_CONFIG|INTERFACES_GLOBAL_SECTION[a-zA-Z0-9_\-]+\n)/);

  var ps_keys=keys(int_post_sections);
  ps_keys.sort();

  /* WTF?
  for(var psi=0; psi < ps_keys.length; psi++) {
    var ps=ps_keys[psi];
    var sect_lines=int_post_sections[ps];
    var sect_a=sect_lines.split(/\n/);
    var new_lines=Array();
    for(var ai=0; ai < sect_a.length; ai++) {
      var found=0;
      for(var an=0; an < ai; an++) {
        if(sect_a[an] == sect_a[ai]) {
          found=1;
          break;
        };
      };
      if(!found || sect_a[ai] == "") {
        new_lines.push(sect_a[ai]);
      };
    };
    int_post_sections[ps]=new_lines.join("\n");
  };
  */

  var int_global_sect="";

  for(var psi=0; psi < ps_keys.length; psi++) {
    var ps=ps_keys[psi];
    var found=0;
    for(var ri=0; ri < res_parts.length; ri++) {
      if(res_parts[ri] == "INTERFACES_GLOBAL_SECTION"+ps+"\n") {
        res_parts[ri]=int_post_sections[ps];
        found=1;
        break;
      };
    };
    if(!found) {
      int_global_sect += int_post_sections[ps];
    };
  };

  for(var ri=0; ri < res_parts.length; ri++) {
    if(res_parts[ri] == "INTERFACES_GLOBAL_CONFIG") {
      res_parts[ri]=int_global_sect;
    } else if(res_parts[ri].match(/INTERFACES_GLOBAL_SECTION/)) {
      res_parts[ri]="";
    };
  };
  res=res_parts.join("");

  res_parts=res.split(/(%(?:{(?:\([^\)}]+\))?[A-Za-z_\-0-9]+}|[A-Za-z_\-0-9]+|\([0-9*+\/\-\(\)]+\))%)/);
  var_errors=0;
  for(var ri=0; ri < res_parts.length; ri++) {
    let vs=var_sub(res_parts[ri]);
    if(vs !== undefined) {
      res_parts[ri]=vs;
    };
  };

  if(var_errors != 0) return;

  res=res_parts.join("");


  $("#result").text(res).show();
};

function add_global_feature_entry(gf, i, cont) {
    var entry=$(DIV)
     .css("margin-bottom", "1em")
     .addClass("globalfeatureentry")
     .prop("data-row-index", i)
     .append(
       handle_label()
     )
     .append(
       $(LABEL).addClass("ns").text("Фильтр: ")
     )
     .append(
       $(INPUT).css("width", "400px").val( config["features"][gf][i]["devfilter"])
        .on("input", function() {
          if(! regex_check_highlight( $(this) )) return;

          var index=$(this).parents(".globalfeatureentry").index();
          var feature=$(this).parents(".globalfeature").prop("data-feature");

          config["features"][feature][index]["devfilter"]=$(this).val();

          config_changed(1);
        })
     )
     .append(
       $(LABEL).addClass("ns").text("Стоп: ").css("margin-left", "1em")
     )
     .append(
       $(INPUT, { type: "checkbox", checked: (config["features"][gf][i]["stop"] == 1)})
        .change(function() {
          var index=$(this).parents(".globalfeatureentry").index();
          var feature=$(this).parents(".globalfeature").prop("data-feature");

          if($(this).is(":checked")) {
            config["features"][feature][index]["stop"]=1;
          } else {
            delete config["features"][feature][index]["stop"];
          };
          config_changed(1);
        })
     )
     .append(
       del_label()
        .click(function() {
          var entrycont=$(this).parents(".globalfeatureentry");
          if(confirm("Подтвердите удаление части "+entrycont.index()+".")) {
            var featurecont=$(this).parents(".globalfeature");
            var newentfilter=featurecont.find(".newfeaturefilter");
            var newentstop=featurecont.find(".newfeaturestop");
            var newentlines=featurecont.find(".newfeaturelines");

            var feature=featurecont.prop("data-feature");
            var index=entrycont.index();

            newentfilter.val( config["features"][feature][index]["devfilter"]);
            newentstop.attr("checked", config["features"][feature][index]["stop"] == 1);
            newentlines.val( config["features"][feature][index]["lines"].join("\n"));

            var sortable=$(this).parents(".globalfeaturesortable");

            entrycont.remove();

            var rows=sortable.find(".globalfeatureentry");

            for(var ri=0; ri < rows.length; ri++) {
              $(rows[ri]).prop("data-row-index", ri);
            };

            config["features"][feature].splice( index, 1);

            config_changed(1);
          };
        })
     )
     .append(
       copy_label()
        .click(function() {
          var entrycont=$(this).parents(".globalfeatureentry");
          var featurecont=$(this).parents(".globalfeature");

          var newentfilter=featurecont.find(".newfeaturefilter");
          var newentstop=featurecont.find(".newfeaturestop");
          var newentlines=featurecont.find(".newfeaturelines");

          var feature=featurecont.prop("data-feature");
          var index=entrycont.index();

          newentfilter.val( config["features"][feature][index]["devfilter"]);
          newentstop.attr("checked", config["features"][feature][index]["stop"] == 1);
          newentlines.val( config["features"][feature][index]["lines"].join("\n"));
        })
     )
     .appendTo( cont )
    ;
    var lines=add_subsection("+", "Строки", entry);

    var ta=$("<TEXTAREA/>")
     .attr("wrap", "off")
     .addClass("globalfeaturelines")
     .css("width", "900px")
     .css("font-family", "monospace")
     .css("font-size", "smaller")
     .val( config["features"][gf][i]["lines"].join("\n") )
     .on("input", function() {
       var index=$(this).parents(".globalfeatureentry").index();
       var feature=$(this).parents(".globalfeature").prop("data-feature");
     
       config["features"][feature][index]["lines"]=$(this).val().split("\n");

       config_changed(1);
     })
    ;

    ta.autoResize({
       maxHeight: "600px"
     })
    ;


    $(DIV)
     .css("margin-top", "10px")
     .append( ta )
     .appendTo( lines )
    ;

};

function add_global_feature(gf, gf_list) {
  var feature_cont=$(DIV)
   .addClass("globalfeature")
   .prop("data-feature", gf)
   .css("margin-bottom", "1em")
   .append( $(LABEL).addClass("ns").text("Часть конфигурации: ") )
   .append(
     $(INPUT, {readonly: true})
      .css("background-color", "#EEEEEE")
      .addClass("globalfeaturename")
      .val(gf)
   )
   .append(
     del_label()
      .click(function() {
        var gf=$(this).parents(".globalfeature").prop("data-feature");
        if(confirm("Подтвердите удаление \""+gf+"\". Восстановление будет невозможным!")) {
          var used=$(this).parents("#te")
           .find(".templateslist")
           .find(".templaterow")
           .find(".templatefeatures")
           .find(".key")
           .filter(function() { return $(this).text() == gf; })
          ;
          if(used.length > 0 && !confirm("\""+gf+"\" используется в "+used.length+" шаблонах. Подтвердите удаление!")) {
            return;
          };
          delete config["features"][gf];
          $(this).parents(".globalfeature").remove();
          features_changed();
          config_changed(1);
        };
      })
   )
   .append(
     copy_label()
      .click(function() {
        if(!new_feature_check()) {
          return;
        };

        var fsect=$(this).parents(".globalfeaturessect");
        var newgfelm=fsect.find(".newglobalfeaturename");
        var newgf=newgfelm.val().replace(/^\s+/, "").replace(/\s+$/, "");

        var feature=$(this).parents(".globalfeature").find("input").val();

        config["features"][newgf]=[];

        for(var i=0; i < config["features"][feature].length; i++) {
          config["features"][newgf].push($.extend(true, {}, config["features"][feature][i]));
        };

        add_global_feature(newgf, fsect.find(".globalfeaturescont"));
        newgfelm.val("");

        features_changed();
        config_changed(1);

      })
   )
   .appendTo( gf_list )
  ;

  var feature_entries_subs=add_subsection("+", "Состав", feature_cont);
  var feature_entries_cont=$(DIV).appendTo(feature_entries_subs);
  feature_entries_cont.sortable({handle: ".handle", axis: "y"});
  feature_entries_cont.addClass("globalfeaturesortable");
  feature_entries_cont.on("sortstop", function() {
    var rows=$(this).find(".globalfeatureentry");
    var feature=$(this).parents(".globalfeature").prop("data-feature");
    var featurelist=[];

    for(var ri=0; ri < rows.length; ri++) {
      var oldindex=$(rows[ri]).prop("data-row-index");
      featurelist.push( $.extend(true, {}, config["features"][feature][oldindex] ) );
      $(rows[ri]).prop("data-row-index", ri);
    };

    config["features"][feature]=featurelist;

    config_changed(1);
  });

  for(var i=0; i < config["features"][gf].length; i++) {
    add_global_feature_entry(gf, i, feature_entries_cont);
  };

  var ta=$("<TEXTAREA/>")
     .attr("wrap", "off")
     .addClass("newfeaturelines")
     .css("width", "900px")
     .css("font-family", "monospace")
     .css("font-size", "smaller")
     .val( "" )
  ;

  ta.autoResize({
     maxHeight: "600px"
   })
  ;

  $(DIV)
   .css("margin-bottom", "1em")
   .addClass("newfeatureentryrow")
   .append(
     $(LABEL).addClass("ns").text("Добавить: ")
   )
   .append( $("<BR/>") )
   .append(
     $(LABEL).addClass("ns").text("Фильтр: ")
   )
   .append(
     $(INPUT).css("width", "400px")
      .addClass("newfeaturefilter")
      .on("input", function() {
        regex_check_highlight($(this));
      })
   )
   .append(
     $(LABEL).addClass("ns").text("Стоп: ").css("margin-left", "1em")
   )
   .append(
     $(INPUT, { type: "checkbox"})
      .addClass("newfeaturestop")
   )
   .append(
     add_label()
      .click(function() {
        var filter=$(this).parents(".newfeatureentryrow").find(".newfeaturefilter").val();

        if(! regex_check_highlight( $(this).parents(".newfeatureentryrow").find(".newfeaturefilter") )) return;

        $(this).parents(".newfeatureentryrow").find(".newfeaturefilter").val("");

        var stop=$(this).parents(".newfeatureentryrow").find(".newfeaturestop").is(":checked");
        $(this).parents(".newfeatureentryrow").find(".newfeaturestop").attr("checked", false);

        var lines=$(this).parents(".newfeatureentryrow").find(".newfeaturelines").val().split("\n");
        $(this).parents(".newfeatureentryrow").find(".newfeaturelines").val("");

        var feature=$(this).parents(".globalfeature").prop("data-feature");
        var index=config["features"][feature].length;
        config["features"][feature].push( {"devfilter" : filter, "lines" : lines } );
        if(stop) config["features"][feature][index]["stop"]=1;

        add_global_feature_entry(feature, index, $(this).parents(".globalfeature").find(".globalfeaturesortable"));

        config_changed(1);

      })
   )
   .append(
     del_label()
      .click(function() {
        $(this).parents(".newfeatureentryrow").find(".newfeaturefilter").val("");
        $(this).parents(".newfeatureentryrow").find(".newfeaturelines").val("");
        $(this).parents(".newfeatureentryrow").find(".newfeaturelines").trigger("focus");
        $(this).parents(".newfeatureentryrow").find(".newfeaturestop").attr("checked", false);
      })
   )
   .append(
     $(DIV)
      .css("margin-top", "5px")
      .append( ta )
   )
   .appendTo( feature_entries_subs )
  ;


};

function features_changed() {
  var templaterows=$(".templatessubsection").find(".templaterow");

  var features=keys(config["features"]);

  for(var i=0; i < templaterows.length; i++) {
    var template=$(templaterows[i]).prop("data-template");
    var template_feats=[];
    if(config["templates"][template]["global_features"] != undefined) {
      template_feats=config["templates"][template]["global_features"];
    };
    var template_feat_add_sel=$(templaterows[i]).find(".templateaddfeatrow").find(".newvaluesel");
    var template_feat_add_opt=template_feat_add_sel.find("option");
    var template_feat_table=$(templaterows[i]).find(".templatefeatureslist");
    var template_feat_list=template_feat_table.find(".key");

    var listed_features=[];

    for(var fi=0; fi < template_feat_add_opt.length; fi++) {
      var feat=$(template_feat_add_opt[fi]).val();
      if(config["features"][feat] == undefined) {
        $(template_feat_add_opt[fi]).remove();
      } else {
        listed_features.push( feat );
      };
    };

    var added_features=[];

    for(var fi=0; fi < template_feat_list.length; fi++) {
      var feat=$(template_feat_list[fi]).text();
      if(config["features"][feat] == undefined) {
        $(template_feat_list[fi]).css("background-color", "#FFBBBB");
      } else {
        $(template_feat_list[fi]).css("background-color", "initial");
        added_features.push( feat );
      };
    };

    for(var fi=0; fi < features.length; fi++) {
      var feat=features[fi];
      if(listed_features.indexOf( feat ) < 0 && added_features.indexOf( feat ) < 0) {
        $("<OPTION/>", { value: feat })
         .text(feat)
         .appendTo(template_feat_add_sel)
        ;
      };
    };
  };

  var roles_rows=$(".rolerow");
  for(var r=0; r < roles_rows.length; r++) {
    var role=$(roles_rows[r]).prop("data-role");
    var depends_list=$(roles_rows[r]).find(".dependtable");
    var depends_entries=depends_list.find(".deprow");
    var depends_sel=$(roles_rows[r]).find(".roleadddepsel");
    var depends_sel_opt=depends_sel.find("option");

    var role_int_conf_feat_sel=$(roles_rows[r]).find(".roleintconfigfeature");
    role_int_conf_feat_sel.css("background-color", "initial");
    var role_int_conf_feat_opt=role_int_conf_feat_sel.find("option");
    var role_glob_conf_feat_sel=$(roles_rows[r]).find(".roleglobconfigfeature");
    role_glob_conf_feat_sel.css("background-color", "initial");
    var role_glob_conf_feat_opt=role_glob_conf_feat_sel.find("option");


    var listed_features=[];
    var added_features=[];

    for(var fi=0; fi < depends_sel_opt.length; fi++) {
      var feat=$(depends_sel_opt[fi]).val();
      if(config["features"][feat] == undefined) {
        $(depends_sel_opt[fi]).remove();
      } else {
        listed_features.push(feat);
      };
    };

    for(var fi=0; fi < depends_entries.length; fi++) {
      var feat=$(depends_entries[fi]).prop("data-feature");
      if(config["features"][feat] == undefined) {
        $(depends_entries[fi]).css("background-color", "#FFBBBB");;
      } else {
        $(depends_entries[fi]).css("background-color", "initial");;
        added_features.push(feat);
      };
    };

    for(var fi=0; fi < role_glob_conf_feat_opt.length; fi++) {
      var feat=$(role_glob_conf_feat_opt[fi]).val();
      if(feat != "") {
        if(config["features"][feat] == undefined) {
          if(! $(role_glob_conf_feat_opt[fi]).is(":selected")) {
            $(role_glob_conf_feat_opt[fi]).remove();
          } else {
            $(role_glob_conf_feat_opt[fi]).parent().css("background-color", "#FFBBBB");
          };
        };
      };
    };

    for(var fi=0; fi < role_int_conf_feat_opt.length; fi++) {
      var feat=$(role_int_conf_feat_opt[fi]).val();
      if(feat != "") {
        if(config["features"][feat] == undefined) {
          if(! $(role_int_conf_feat_opt[fi]).is(":selected")) {
            $(role_int_conf_feat_opt[fi]).remove();
          } else {
            $(role_int_conf_feat_opt[fi]).parent().css("background-color", "#FFBBBB");
          };
        };
      };
    };

    for(var fi=0; fi < features.length; fi++) {
      var feat=features[fi];
      if(listed_features.indexOf( feat ) < 0 && added_features.indexOf( feat ) < 0) {
        $("<OPTION/>", { value: feat })
         .text(feat)
         .appendTo(depends_sel)
        ;
      };
      for(var s=0; s < role_glob_conf_feat_sel.length; s++) {
        var opts=$(role_glob_conf_feat_sel[s]).find("option").filter(function() { return $(this).val() == feat; });
        if(opts.length == 0) {
          $(role_glob_conf_feat_sel[s]).append(
            $("<OPTION/>", { value: feat })
             .text(feat)
          );
        };
      };
      for(var s=0; s < role_int_conf_feat_sel.length; s++) {
        var opts=$(role_int_conf_feat_sel[s]).find("option").filter(function() { return $(this).val() == feat; });
        if(opts.length == 0) {
          $(role_int_conf_feat_sel[s]).append(
            $("<OPTION/>", { value: feat })
             .text(feat)
          );
        };
      };
    };
  };

};

function add_template(template, te_list) {
  var te_row=$(DIV)
   .addClass("templaterow")
   .prop("data-template", template)
   .css("margin-top", "1em")
   .append( $(LABEL).addClass("ns").text("Шаблон: ") )
   .append(
     $(INPUT, { value: template, readonly: true})
      .css("background-color", "#EEEEEE")
      .addClass("templatename")
   )
   .append( $(LABEL).addClass("ns").text(" Описание: ") )
   .append(
     $(INPUT, { value: config["templates"][template]["description"] != undefined?config["templates"][template]["description"]:"" })
      .css("width", "400px")
      .on("input", function() {
        var descr=$(this).val();
        var template=$(this).parents(".templaterow").prop("data-template");
        config["templates"][template]["description"]=descr;
        config_changed(1);
      })
   )
   .append(
     del_label()
      .click(function() {
        var template=$(this).parents(".templaterow").prop("data-template");
        if(confirm("Подтвердите удаление шаблона \""+template+"\"")) {
          delete config["templates"][template];
          $(this).parents(".templatessubsection").find(".newtemplaterow").find("input").val(template);
          $(this).parents(".templatessubsection").find(".newtemplaterow").find("input").css("background-color", "initial");
          $(this).parents(".templaterow").remove();
          config_changed(1);
        };
      })
   )
   .append(
     copy_label()
      .prop("title", "Копировать. Предврительно задайте имя шаблона внизу")
      .click(function() {
        var templateelm=$(this).parents(".templatessubsection").find(".newtemplaterow").find("input");
        var template=templateelm.val();
        var source=$(this).parents(".templaterow").prop("data-template");
        templateelm.css("background-color", "initial");
        if(template == undefined || template.match(/^\s*$/)) {
          templateelm.css("background-color", "#FFBBBB");
          return;
        };
        template=template.replace(/^\s+/, "").replace(/\s+$/,"");

        var templatenames=$(this).parents(".templatessubsection").find(".templatename").filter(function() { return $(this).val() == template });
        if(templatenames.length > 0 || !template.match(/^[a-zA-Z0-9_\-]+$/)) {
          templateelm.css("background-color", "#FFBBBB");
          return;
        };

        if(config["templates"][source] != undefined) {
          config["templates"][template]=$.extend(true, {}, config["templates"][source]);
          add_template(template, $(this).parents(".templatessubsection").find(".templateslist"));
          config_changed(1);
        };

      })
   )
   .appendTo(te_list)
  ;

  var te_contents=add_subsection("+", "Настройка шаблона", te_row);

  te_contents.append(
     $(LABEL).addClass("ns").text("По умолчанию: ")
   )
   .append(
     $(INPUT, { type: "checkbox", checked: config["templates"][template]["default"] == 1})
      .addClass("templatedefault")
      .on("change", function() {
        var template=$(this).parents(".templaterow").prop("data-template");
        if( $(this).is(":checked") ) {
          config["templates"][template]["default"]=1;
        } else {
          delete config["templates"][template]["default"];
        };
        config_changed(1);
      })
   )
   .append(
     $(LABEL).addClass("ns").text("Порядок: ")
   )
   .append(
     $(INPUT, { value: config["templates"][template]["order"] != undefined?config["templates"][template]["order"]:"100" })
      .addClass("templateorder")
      .on("input", function() {
        var order=$(this).val();
        if(! order.match(/^\d*$/)) {
          $(this).css("background-color", "#FFBBBB");
          return;
        } else {
          $(this).css("background-color", "initial");
        };
        var template=$(this).parents(".templaterow").prop("data-template");
        if( order.match(/^\d+$/) ) {
          config["templates"][template]["order"]=Number(order);
        } else {
          config["templates"][template]["order"]=100;
        };
        config_changed(1);
      })
      .css("width", "3em")
   )
   .append( $("<BR/>") )
   .append(
     $(LABEL).addClass("ns").text("Фильтр по типу устройства: ")
   )
   .append(
     $(INPUT, { value: config["templates"][template]["devfilter"] != undefined?config["templates"][template]["devfilter"]:"" })
      .addClass("templatefilter")
      .on("input", function() {
        if(! regex_check_highlight( $(this) )) return;
        var template=$(this).parents(".templaterow").prop("data-template");
        config["templates"][template]["devfilter"]=$(this).val();
        config_changed(1);
      })
      .css("width", "400px")
   )
  ;

  var template_vars_sub=add_subsection("+", "Переменные шаблона", te_contents);

  var template_vars=$(DIV)
   .addClass("templatevars")
   .css("display", "table")
   .appendTo(template_vars_sub)
  ;

  $(DIV)
   .css("display", "table-row")
   .addClass("ns")
   .append(
     $(DIV)
      .css("display", "table-cell")
      .append( $(LABEL).text("Переменная") )
   )
   .append(
     $(DIV)
      .css("padding-left", "1em")
      .css("display", "table-cell")
      .append( $(LABEL).text("Значение по умолчанию") )
   )
   .append(
     $(DIV)
      .css("padding-left", "1em")
      .css("display", "table-cell")
      .append( $(LABEL).text(" ") )
   )
   .appendTo( template_vars )
  ;

  var varslist=[];

  if(config["templates"][template]["variables"] != undefined) {
    for(var varname in config["templates"][template]["variables"]) {
      if(config["variables"] != undefined && config["variables"][varname] != undefined) {
        varslist.push(varname);
      };
    };
  };

  varslist.sort(function(a, b) {
    if(config["variables"][a]["order"] != config["variables"][b]["order"]) {
      return (config["variables"][a]["order"] - config["variables"][b]["order"]);
    };
    return String(a).localeCompare(String(b));
  });

  for(var vi=0; vi < varslist.length; vi++) {
    var varname = varslist[vi];
    template_add_var(varname, template, template_vars);
  };

  var varssel=$("<SELECT/>")
   .addClass("templatenewvarsel")
   .append( $("<OPTION/>", { value: "", selected: true }) )
  ;

  var othervars = [];

  for(var varname in config["variables"]) {
    if(varslist.indexOf( varname ) == -1) {
      othervars.push(varname);
    };
  };

  othervars.sort(function(a, b) {
    if(config["variables"][a]["order"] != config["variables"][b]["order"]) {
      return (config["variables"][a]["order"] - config["variables"][b]["order"]);
    };
    return String(a).localeCompare(String(b));
  });

  for(var vi=0; vi < othervars.length; vi++) {
    var varname = othervars[vi];
    $("<OPTION/>", { value: varname })
     .text(varname)
     .appendTo(varssel);
  };

  $(DIV)
   .addClass("templatenewvarrow")
   .css("display", "table-row")
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-top", "1em")
      .append( varssel )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-top", "1em")
      .css("padding-left", "1em")
      .append(
        $(INPUT)
         .addClass("templatenewvarval")
         .css("width", "400px")
      )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .append(
        add_label()
         .click(function() {
           var varvalue=$(this).parents(".templatenewvarrow").find("input").val();
           var varname=$(this).parents(".templatenewvarrow").find("select").val();
           if(varname != undefined && varname != "") {
             var varnames=$(this).parents(".templatevars").find(".templatevarname").filter(function() { return $(this).val() == varname; });
             if(varnames.length == 0) {

               config["templates"][template]["variables"][varname]=varvalue;

               template_add_var(varname, template, template_vars);

               $(this).parents(".templatenewvarrow").find("input").val("");
               var sel=$(this).parents(".templatenewvarrow").find("select");
               sel.val("");
               sel.find("option").filter(function() { return $(this).val() == varname } ).remove();

               config_changed(1);
             };
           };
         })
      )
   )
   .appendTo( template_vars )
  ;

  var template_features_sub=add_subsection("+", "Части конфигурации. Опционально: нет/да-вкл/да-выкл", te_contents);

  var template_features_cont=$(DIV)
   .addClass("templatefeatures")
   .appendTo( template_features_sub );

  var tfs=$(DIV).addClass("sortable").appendTo(template_features_cont);

  tfs.css("display", "table");
  tfs.sortable({ handle: ".handle", cursor: "move"});
  tfs.addClass("uniquekeys");
  tfs.addClass("templatefeatureslist");
  tfs.on("sortstop", function() {
    template_features_change( $(this) );
  });

  var template_features=[];

  for(var fi=0; fi < config["templates"][template]["global_features"].length; fi++) {
    var feat=config["templates"][template]["global_features"][fi];
    if(config["features"] != undefined && config["features"][ feat ] != undefined) {
      var optional="off";
      if(config["templates"][template]["optional_features"] != undefined &&
         config["templates"][template]["optional_features"][feat] != undefined) {
        optional=config["templates"][template]["optional_features"][feat];
      };
      add_sortable_key(feat, tfs, template_features_change, template_feature_remove_add_check,optional_features_changed,optional);
      template_features.push(feat);
    };
  };

  var template_feat_sel=$("<SELECT/>")
   .addClass("newvaluesel")
   .append( $("<OPTION/>", { value: "", selected: true }).text("") );

  for(var feat in config["features"]) {
    if(template_features.indexOf( feat ) == -1) {
      $("<OPTION/>", { value: feat })
       .text(feat)
       .appendTo(template_feat_sel)
      ;
    };
  };

  $(DIV)
   .addClass("templateaddfeatrow")
   .css("margin-top", "1em")
   .append( template_feat_sel )
   .append(
     add_label()
      .click(function() {
        var valuesel=$(this).parents(".templatefeatures").find(".newvaluesel");
        if(valuesel.length > 0) {
          var feature=valuesel.val();
          if(feature != "" && feature != undefined && config["features"] != undefined && config["features"][feature] != undefined) {
            add_sortable_key(feature, tfs, template_features_change, template_feature_remove_add_check,optional_features_changed,"off");
            valuesel.find("option").filter(function() { return $(this).val() == feature }).remove();
            template_features_change( $(this) );
          };
        };
      })
   )
   .appendTo( template_features_cont )
  ;

  var int_roles_sub=add_subsection("+", "Роли интерфейсов", te_contents);
  var int_roles_table=$(DIV)
   .css("display", "table")
   .addClass("templateinttable")
   .appendTo(int_roles_sub)
  ;

  int_roles_table.sortable({ axis: "y", handle: ".handle", items: ".sort"});

  int_roles_table.on("sortstop", function() {
    var template=$(this).parents(".templaterow").prop("data-template");
    var rows=$(this).find(".templateintrow");
    var int_array=[];
    for(var i=0; i < rows.length; i++) {
      var oldindex=$(rows[i]).prop("data-row-index");
      int_array.push( $.extend(true, {}, config["templates"][template]["interfaces"][oldindex]) );
      $(rows[i]).prop("data-row-index", i);
    };
    config["templates"][template]["interfaces"]=int_array;
    config_changed(1);
  });

  $(DIV)
   .addClass("ns")
   .css("display", "table-row")
   .append(
     $(DIV)
      .css("display", "table-cell")
      .text("")
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .text("Фильтр")
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .text("Префикс")
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .text("Список")
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .text("Роль")
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .text("")
   )
   .appendTo( int_roles_table )
  ;

  var rolelist=$("<SELECT/>")
   .addClass("templateintrolessel")
   .append( $("<OPTION/>", { value: "" }).text("") );

  for(var role in config["roles"]) {
    $("<OPTION/>", { value: role})
     .text(role)
     .appendTo( rolelist );
  };

  var newintrow=$(DIV)
   .css("display", "table-row")
   .addClass("templatenewintrow")
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-top", "1em")
      .text("")
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .css("padding-top", "1em")
      .append( $(INPUT).css("width", "300px") )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .css("padding-top", "1em")
      .append( $(INPUT).css("width", "100px") )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .css("padding-top", "1em")
      .append( $(INPUT).css("width", "50px") )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .css("padding-top", "1em")
      .append( rolelist )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .css("padding-top", "1em")
      .append(
        add_label()
         .click(function() {
           var template=$(this).parents(".templaterow").prop("data-template");
           var newintrow=$(this).parents(".templatenewintrow");

           newintrow.css("background-color", "initial");
           if(newintrow.length == 0) return;
           var newinputs=newintrow.find("input");
           var newsel=newintrow.find("select");

           if(newinputs.length != 3 || newsel.length == 0) return;

           var newfilterelm=$(newinputs[0]);
           var newprefixelm=$(newinputs[1]);
           var newlistelm=$(newinputs[2]);

           newfilterelm.css("background-color", "initial");
           newprefixelm.css("background-color", "initial");
           newlistelm.css("background-color", "initial");

           var existingrows=$(this).parents(".templateinttable").find(".templateintrow");
           existingrows.css("background-color", "initial");

           var index=existingrows.length;

           if(newsel.val() == undefined || newsel.val() == "") {
             return;
           };

           try {
             new RegExp(newfilterelm.val());
           } catch(e) {
             newintrow.css("background-color", "#FFEEEE");
             newfilterelm.css("background-color", "#FFBBBB");
             return;
           };

           if(newprefixelm.val() == undefined || newprefixelm.val() == "") {
             newintrow.css("background-color", "#FFEEEE");
             newprefixelm.css("background-color", "#FFBBBB");
             return;
           };

           if(newlistelm.val() == undefined || ! newlistelm.val().match(/^(?:\d+(?:-\d+)?)(?:,\d+(?:-\d+)?)*$|^(?:\d+(?:-\d+)?)?$/)) {
             newintrow.css("background-color", "#FFEEEE");
             newlistelm.css("background-color", "#FFBBBB");
             return;
           };

           var errors=0;

           for(var ri=0; ri < existingrows.length; ri++) {
             var exist_filter=$(existingrows[ri]).find(".devfilter").text();
             var exist_prefix=$(existingrows[ri]).find(".prefix").text();
             var exist_list=$(existingrows[ri]).find(".list").text();
             var exist_role=$(existingrows[ri]).find(".role").text();

             if(exist_filter == newfilterelm.val() && exist_prefix == newprefixelm.val() && exist_list == newlistelm.val()) {
               $(existingrows[ri]).css("background-color", "#FFEEEE");
               errors++;
             };
           };

           if(errors) {
             newintrow.css("background-color", "#FFEEEE");
             return;
           };

           config["templates"][template]["interfaces"].push( {
             devfilter: newfilterelm.val(),
             prefix: newprefixelm.val(),
             list: newlistelm.val(),
             role: newsel.val()
           });


           template_add_int_role(template, index, newintrow);

           config_changed(1);
           
         })
      )
      .append(
        del_label()
         .click( function() {
           var newintrow=$(this).parents(".templateinttable").find(".templatenewintrow");
           var newinputs=newintrow.find("input");
           var newsel=newintrow.find("select");

           $(newinputs[0]).val("");
           $(newinputs[1]).val("");
           $(newinputs[2]).val("");
           newsel.val("");
         })
      )
   )
   .appendTo( int_roles_table )
  ;

  if(config["templates"][template]["interfaces"] != undefined) {
    for(var i=0; i < config["templates"][template]["interfaces"].length; i++) {
      template_add_int_role(template, i, newintrow);
    };
  };

};

var optional_feats={};

function template_selected() {
  var var_div=$("#dev_variables");
  var_div.empty();

  var int_div=$("#interfaces");
  int_div.empty();

  $("#dev_options").empty();

  $("#result").text("").hide();

  var template=$("#template").val();
  if(template == undefined || template == "") {
    $("#message").text("No template selected");
    return;
  };

  var devtype=$("#devtype").val();
  if(devtype == undefined || devtype == "") {
    $("#message").text("No device type selected");
    return;
  };

  var opts_div=$(DIV)
   .css("margin-top", "1em")
   .append( $(LABEL).text("Опции (вкл/выкл)") )
  ;

  optional_feats={};

  if(config["templates"][template]["optional_features"] != undefined) {
    for(var fi=0; fi < config["templates"][template]["global_features"].length; fi++) {
      var feat=config["templates"][template]["global_features"][fi];
      if(config["templates"][template]["optional_features"][feat] != undefined && config["templates"][template]["optional_features"][feat] != "off") {
        optional_feats[feat]=config["templates"][template]["optional_features"][feat];

        $(DIV)
         .css("display", "table-row")
         .append(
           $(LABEL)
            .css("display", "table-cell")
            .text(feat)
         )
         .append(
           $("<FORM/>")
            .css("display", "table-cell")
            .append(
              $(INPUT, { type: "radio", name: "optional", value: "on-on", checked: (optional_feats[feat] == "on-on")})
               .prop("data-feat", feat)
               .on("change", function() {
                 var feat=$(this).prop("data-feat");
                 var opt=$(this).parent().find("input[name=optional]:checked").val();
                 optional_feats[feat]=opt;

                 $(".int_role").each(function() {
                   let intf=$(this).prop("data-int");
                   let select_role=$(this).val();
                   $(this).find("OPTION").each(function() {
                     if($(this).val() == "") return true;
                     let role=$(this).val();
                     let disabled=false;
                     if(config["roles"][role]["require"] !== undefined) {
                       let req=config["roles"][role]["require"];
                       for(let rr=0; rr < req.length; rr++) {
                         if(optional_feats[req[rr]] == "on-off") {
                           disabled=true;
                           break;
                         };
                       };
                     };
                     $(this).prop("disabled", disabled);
                     if(select_role == role && disabled) select_role="";
                   });
                   $(this).val(select_role);
                 });

                 var_input();
               })
            )
            .append(
              $(INPUT, { type: "radio", name: "optional", value: "on-off", checked: (optional_feats[feat] == "on-off")})
               .prop("data-feat", feat)
               .on("change", function() {
                 var feat=$(this).prop("data-feat");
                 var opt=$(this).parent().find("input[name=optional]:checked").val();
                 optional_feats[feat]=opt;
                 $(".int_role").each(function() {
                   let intf=$(this).prop("data-int");
                   let select_role=$(this).val();
                   $(this).find("OPTION").each(function() {
                     if($(this).val() == "") return true;
                     let role=$(this).val();
                     let disabled=false;
                     if(config["roles"][role]["require"] !== undefined) {
                       let req=config["roles"][role]["require"];
                       for(let rr=0; rr < req.length; rr++) {
                         if(optional_feats[req[rr]] == "on-off") {
                           disabled=true;
                           break;
                         };
                       };
                     };
                     $(this).prop("disabled", disabled);
                     if(select_role == role && disabled) select_role="";
                   });
                   $(this).val(select_role);
                 });
                 var_input();
               })
            )
         )
         .appendTo( opts_div )
        ;
      };
    };
  };

  if(keys(optional_feats).length > 0) {
    opts_div.appendTo( $("#dev_options") );
  };


  var var_list=keys(config["variables"]);
  var_list.sort(function(a,b) {
    if(config["variables"][a]["order"] != config["variables"][b]["order"]) {
      return (config["variables"][a]["order"] - config["variables"][b]["order"]);
    };
    return String(a).localeCompare(String(b));
  });
  if(config["templates"][template]["variables"] != undefined) {
    var_div.append( $(DIV).text("Переменные:") );
    for(var vi=0; vi < var_list.length; vi++) {
      var varname=var_list[vi];
      if(config["templates"][template]["variables"][ varname ] != undefined) {
        var val=config["templates"][template]["variables"][ varname ];
        var check=config["variables"][ varname ]["check"];

        $(DIV, { id: "var_row_"+varname })
         .css("display", "table-row")
         .addClass("var_row")
         .append(
           $(DIV)
            .css("display", "table-cell")
            .append( $(LABEL).text( config["variables"][ varname ]["name"] ) )
         )
         .append(
           $(DIV)
            .css("display", "table-cell")
            .css("white-space", "pre")
            .text("    ")
         )
         .append(
           $(DIV)
            .css("display", "table-cell")
            .append(
              $(INPUT)
               .css("width", "400px")
               .prop("id", "var_value_"+varname)
               .prop("data-varname", varname)
               .prop("data-check", check)
               .val( val )
               .on("input", var_input )
            )
         )
         .appendTo(var_div);
      };
    };
  };
  var roles_list=[];

  for(var role in config["roles"]) {
    var req=config["roles"][role]["require"];
    var matched=1;
    for(var r=0; r < req.length; r++) {
      if(config["templates"][template]["global_features"].indexOf(req[r]) == -1) {
        matched=0;
        break;
      };
    };
    if(matched) roles_list.push(role);
  };

  if(config["templates"][template]["interfaces"] != undefined) {
    var int_list=[];
    var int_roles={};
    for(var i=0; i < config["templates"][template]["interfaces"].length; i++) {
      var dev_re=new RegExp(config["templates"][template]["interfaces"][i]["devfilter"]);
      if(dev_re.test(devtype)) {
        var int_prefix=config["templates"][template]["interfaces"][i]["prefix"];
        var list=config["templates"][template]["interfaces"][i]["list"];
        var role=config["templates"][template]["interfaces"][i]["role"];
        if(roles_list.indexOf(role) == -1) {
          $("#message").text("Not valid role \""+role+"\" for interfaces list index "+i);
          return;
        };

        if(list != "") {
          var list_a=list.split(",");
          for(var li=0; li < list_a.length; li++) {
            var range_a;
            if(/^\d+$/.test(list_a[li])) {
              var n=int_prefix+list_a[li];
              if(int_list.indexOf(n) != -1) {
                $("#message").text("Duplicate interface \""+n+"\" in list index "+i);
                return;
              };
              int_list.push(n);
              int_roles[n]=role;
            } else if(range_a=list_a[li].match(/^(\d+)-(\d+)$/)) {
              var start=Number(range_a[1]);
              var end=Number(range_a[2]);
              if(start >= end) {
                $("#message").text("Invalid range entry \""+list_a[li]+"\" in list index "+i);
                return;
              };
              for(var ri=start; ri <= end; ri++) {
                var n=int_prefix+ri.toString();
                if(int_list.indexOf(n) != -1) {
                  $("#message").text("Duplicate interface \""+n+"\" in range in list index "+i);
                  return;
                };
                int_list.push(n);
                int_roles[n]=role;
              };
            } else {
              $("#message").text("Invalid list entry \""+list_a[li]+"\" in list index "+i);
              return;
            };
          };
        } else {
          var n=int_prefix;
          if(int_list.indexOf(n) != -1) {
            $("#message").text("Duplicate interface \""+n+"\" in range in list index "+i);
            return;
          };
          int_list.push(n);
          int_roles[n]=role;
        };
      };
    };

    if(int_list.length == 0) {
      $("#message").text("WARNING: No interfaces to config!");
    } else {
      $(DIV).text("Роли:").appendTo(int_div);

      for(var inti=0; inti < int_list.length; inti++) {
        var role_sel=$("<SELECT/>")
         .addClass("int_role")
         .prop("data-int", int_list[inti])
         .on("change", var_input);

        $("<OPTION/>", {value: ""}).text("Выбрать...").appendTo(role_sel);

        for(var r=0; r < roles_list.length; r++) {
          let disabled=false;
          let role=roles_list[r];
          if(config["roles"][role]["require"] !== undefined) {
            let req=config["roles"][role]["require"];
            for(let rr=0; rr < req.length; rr++) {
              if(optional_feats[req[rr]] == "on-off") {
                disabled=true;
                break;
              };
            };
            if(config["roles"][role]["intfilter"] !== undefined) {
              let intfilter_re=new RegExp(config["roles"][role]["intfilter"]);
              if(!intfilter_re.test(int_list[inti])) {
                continue;
              };
            };
          };

          $("<OPTION/>", { selected: (roles_list[r] == int_roles[ int_list[inti] ]) && !disabled, value: roles_list[r], disabled: disabled }).text( roles_list[r] )
           .appendTo(role_sel);
        };

        $(DIV)
         .css("display", "table-row")
         .append(
           $(DIV)
            .css("display", "table-cell")
            .append( $(LABEL).text(int_list[inti]) )
         )
         .append(
           $(DIV)
            .css("display", "table-cell")
            .css("white-space", "pre")
            .append( $(LABEL).text("  ") )
         )
         .append(
           $(DIV)
            .css("display", "table-cell")
            .append( role_sel )
         )
         .appendTo( int_div );
      };
    };
  };
  var_input();
};

function del_depend() {
  var deldep=$(this).parents(".deprow").prop("data-feature");
  var sel=$(this).parents(".dependsect").find("select");
  var role=$(this).parents(".rolerow").prop("data-role");

  $(this).parents(".deprow").remove();

  var index=config["roles"][role]["require"].indexOf( deldep );
  config["roles"][role]["require"].splice(index, 1);

  if(config["features"][deldep] != undefined) {
    var check=sel.find("option").filter(function() { return $(this).val() == deldep; });
    if(check.length == 0) {
      sel.append( $("<OPTION/>", { value: deldep }).text(deldep) );
      sel.val(deldep);
    };
  };
  config_changed(1);
};

function add_role_int_config(role, i, int_sortable) {
  var feat_sel=$("<SELECT/>")
   .addClass("roleintconfigfeature")
   .css("margin-left", "1em")
   .append(
     $("<OPTION/>", { value: "", selected: (config["roles"][role]["int_config"][i]["feature"] == undefined) })
      .text("")
   )
   .on("change", function() {
     var feature=$(this).val();
     if(feature == "") {
       feature=undefined;
     };

     if(feature == undefined || config["features"][feature] != undefined) {
       $(this).css("background-color", "initial");
     } else if(config["features"][feature] == undefined) {
       $(this).css("background-color", "#FFBBBB");
     };
     
     
     var index=$(this).parents(".roleintconfigrow").index();
     var role=$(this).parents(".rolerow").prop("data-role");
     if(feature != undefined) {
       config["roles"][role]["int_config"][index]["feature"]=feature;
     } else {
       delete config["roles"][role]["int_config"][index]["feature"];
     };

     // WTF
     config_changed(1);
   })
  ;
  for(var feature in config["features"]) {
    $("<OPTION/>", { value: feature, selected: (config["roles"][role]["int_config"][i]["feature"] == feature) })
     .text(feature)
     .appendTo(feat_sel)
    ;
  };

  var row=$(DIV)
   .addClass("roleintconfigrow")
   .prop("data-row-index", i)
   .css("margin-bottom", "1em")
   .append( handle_label() )
   .append( $(LABEL).addClass("ns").text("Фильтр: ") )
   .append(
     $(INPUT)
      .addClass("roleintconfigfilter")
      .css("width", "400px")
      .val( config["roles"][role]["int_config"][i]["devfilter"] )
      .on("input", function() {
        if(! regex_check_highlight( $(this) )) return;

        var index=$(this).parents(".roleintconfigrow").index();
        var role=$(this).parents(".rolerow").prop("data-role");
        
        config["roles"][role]["int_config"][index]["devfilter"]=$(this).val();

        config_changed(1);
      })
   )
   .append(  $(LABEL).addClass("ns").text(" Зависимость: ") )
   .append(  $(LABEL).addClass("ns").text(" !") )
   .append(
     $(INPUT, { type: "checkbox", checked: ( config["roles"][role]["int_config"][i]["invert"] === 1) })
      .addClass("roleintconfiginvert")
      .change(function() {
        var index=$(this).parents(".roleintconfigrow").index();
        var role=$(this).parents(".rolerow").prop("data-role");
        
        if($(this).is(":checked")) {
          config["roles"][role]["int_config"][index]["invert"]=1;
        } else {
          delete config["roles"][role]["int_config"][index]["invert"];
        };

        config_changed(1);
      })
   )
   .append( feat_sel )
   .append(  $(LABEL).addClass("ns").text(" Стоп: ") )
   .append(
     $(INPUT, { type: "checkbox", checked: ( config["roles"][role]["int_config"][i]["stop"] == 1) })
      .addClass("roleintconfigstop")
      .change(function() {
        var index=$(this).parents(".roleintconfigrow").index();
        var role=$(this).parents(".rolerow").prop("data-role");
        
        if($(this).is(":checked")) {
          config["roles"][role]["int_config"][index]["stop"]=1;
        } else {
          delete config["roles"][role]["int_config"][index]["stop"];
        };

        config_changed(1);
      })
   )
   .append(
     del_label()
      .click(function() {
        var filter=$(this).parents(".roleintconfigrow").find(".roleintconfigfilter");
        if(! regex_check_highlight(filter)) return;
        var stop=$(this).parents(".roleintconfigrow").find(".roleintconfigstop").is(":checked");
        var invert=$(this).parents(".roleintconfigrow").find(".roleintconfiginvert").is(":checked");
        var lines=$(this).parents(".roleintconfigrow").find(".roleintconfiglines").val();

        if(confirm("Подтвердите удаление. Данные будут перенесены в поле добавления.")) {
          $(this).parents(".roleintsect").find(".newroleintconfigfilter").val( filter.val() );
          $(this).parents(".roleintsect").find(".newroleintconfigstop").attr("checked", stop );
          $(this).parents(".roleintsect").find(".newroleintconfiginvert").attr("checked", invert );
          $(this).parents(".roleintsect").find(".newroleintconfiglines").val( lines );

          var index=$(this).parents(".roleintconfigrow").index();
          var role=$(this).parents(".rolerow").prop("data-role");

          var intsortable=$(this).parents(".intsortable");

          $(this).parents(".roleintconfigrow").remove();

          config["roles"][role]["int_config"].splice(index, 1);

          var int_conf_rows=intsortable.find(".roleintconfigrow");
          for(var i=0; i < int_conf_rows.length; i++) {
            $(int_conf_rows[i]).prop("data-row-index", i);
          };

          config_changed(1);
        };
      })
   )
   .append(
     copy_label()
      .click(function() {
        var filter=$(this).parents(".roleintconfigrow").find(".roleintconfigfilter");
        var stop=$(this).parents(".roleintconfigrow").find(".roleintconfigstop").is(":checked");
        var invert=$(this).parents(".roleintconfigrow").find(".roleintconfiginvert").is(":checked");
        var lines=$(this).parents(".roleintconfigrow").find(".roleintconfiglines").val();

        $(this).parents(".roleintsect").find(".newroleintconfigfilter").val( filter.val() );
        $(this).parents(".roleintsect").find(".newroleintconfigstop").attr("checked", stop );
        $(this).parents(".roleintsect").find(".newroleintconfiginvert").attr("checked", invert );
        $(this).parents(".roleintsect").find(".newroleintconfiglines").val( lines );

      })
   )
  ;

  var lines=add_subsection("+", "Строки", row);

  var ta= $("<TEXTAREA/>")
   .attr("wrap", "off")
   .addClass("roleintconfiglines")
   .css("width", "900px")
   .css("font-family", "monospace")
   .css("font-size", "smaller")
   .val( config["roles"][role]["int_config"][i]["lines"].join("\n") )
   .on("input", function() {

     var index=$(this).parents(".roleintconfigrow").index();
     var role=$(this).parents(".rolerow").prop("data-role");
     
     config["roles"][role]["int_config"][index]["lines"]=$(this).val().split("\n");

     config_changed(1);
   })
  ;
  ta.autoResize({
     maxHeight: "600px"
   })
  ;

  $(DIV)
   .append( ta )
   .appendTo( lines )
  ;

  row.appendTo(int_sortable);
};

function add_role_glob_config(role, i, glob_sortable) {
  var feat_sel=$("<SELECT/>")
   .addClass("roleglobconfigfeature")
   .css("margin-left", "1em")
   .append(
     $("<OPTION/>", { value: "", selected: (config["roles"][role]["global_post_config"][i]["feature"] == undefined) })
      .text("")
   )
   .on("change", function() {
     var feature=$(this).val();
     if(feature == "") {
       feature=undefined;
     };

     if(feature == undefined || config["features"][feature] != undefined) {
       $(this).css("background-color", "initial");
     } else if(config["features"][feature] == undefined) {
       $(this).css("background-color", "#FFBBBB");
     };
     
     var index=$(this).parents(".roleglobconfigrow").index();
     var role=$(this).parents(".rolerow").prop("data-role");
     if(feature != undefined) {
       config["roles"][role]["global_post_config"][index]["feature"]=feature;
     } else {
       delete config["roles"][role]["global_post_config"][index]["feature"];
     };

     // WTF
     config_changed(1);
   })
  ;
  for(var feature in config["features"]) {
    $("<OPTION/>", { value: feature, selected: (config["roles"][role]["global_post_config"][i]["feature"] == feature) })
     .text(feature)
     .appendTo(feat_sel)
    ;
  };

  var row=$(DIV)
   .addClass("roleglobconfigrow")
   .prop("data-row-index", i)
   .css("margin-bottom", "1em")
   .append( handle_label() )
   .append( $(LABEL).addClass("ns").text("Фильтр: ") )
   .append(
     $(INPUT)
      .addClass("roleglobconfigfilter")
      .css("width", "400px")
      .val( config["roles"][role]["global_post_config"][i]["devfilter"] )
      .on("input", function() {
        if(! regex_check_highlight( $(this) )) return;

        var index=$(this).parents(".roleglobconfigrow").index();
        var role=$(this).parents(".rolerow").prop("data-role");
        
        config["roles"][role]["global_post_config"][index]["devfilter"]=$(this).val();

        config_changed(1);
      })
   )
   .append(  $(LABEL).addClass("ns").text(" Зависимость: ") )
   .append(  $(LABEL).addClass("ns").text(" !") )
   .append(
     $(INPUT, { type: "checkbox", checked: ( config["roles"][role]["global_post_config"][i]["invert"] === 1) })
      .addClass("roleglobconfiginvert")
      .change(function() {
        var index=$(this).parents(".roleglobconfigrow").index();
        var role=$(this).parents(".rolerow").prop("data-role");
        
        if($(this).is(":checked")) {
          config["roles"][role]["global_post_config"][index]["invert"]=1;
        } else {
          delete config["roles"][role]["global_post_config"][index]["invert"];
        };

        config_changed(1);
      })
   )
   .append( feat_sel )
   .append(  $(LABEL).addClass("ns").text(" Стоп: ") )
   .append(
     $(INPUT, { type: "checkbox", checked: ( config["roles"][role]["global_post_config"][i]["stop"] == 1) })
      .addClass("roleglobconfigstop")
      .change(function() {
        var index=$(this).parents(".roleglobconfigrow").index();
        var role=$(this).parents(".rolerow").prop("data-role");
        
        if($(this).is(":checked")) {
          config["roles"][role]["global_post_config"][index]["stop"]=1;
        } else {
          delete config["roles"][role]["global_post_config"][index]["stop"];
        };

        config_changed(1);
      })
   )
   .append(
     del_label()
      .click(function() {
        var filter=$(this).parents(".roleglobconfigrow").find(".roleglobconfigfilter");
        if(! regex_check_highlight(filter)) return;
        var stop=$(this).parents(".roleglobconfigrow").find(".roleglobconfigstop").is(":checked");
        var invert=$(this).parents(".roleglobconfigrow").find(".roleglobconfiginvert").is(":checked");
        var lines=$(this).parents(".roleglobconfigrow").find(".roleglobconfiglines").val();

        if(confirm("Подтвердите удаление. Данные будут перенесены в поле добавления.")) {
          $(this).parents(".roleglobsect").find(".newroleglobconfigfilter").val( filter.val() );
          $(this).parents(".roleglobsect").find(".newroleglobconfigstop").attr("checked", stop );
          $(this).parents(".roleglobsect").find(".newroleglobconfiginvert").attr("checked", invert );
          $(this).parents(".roleglobsect").find(".newroleglobconfiglines").val( lines );

          var index=$(this).parents(".roleglobconfigrow").index();
          var role=$(this).parents(".rolerow").prop("data-role");

          var globsortable=$(this).parents(".globsortable");

          $(this).parents(".roleglobconfigrow").remove();

          config["roles"][role]["global_post_config"].splice(index, 1);

          var glob_conf_rows=globsortable.find(".roleglobconfigrow");
          for(var i=0; i < glob_conf_rows.length; i++) {
            $(glob_conf_rows[i]).prop("data-row-index", i);
          };

          config_changed(1);
        };
      })
   )
   .append(
     copy_label()
      .click(function() {
        var filter=$(this).parents(".roleglobconfigrow").find(".roleglobconfigfilter");
        var stop=$(this).parents(".roleglobconfigrow").find(".roleglobconfigstop").is(":checked");
        var invert=$(this).parents(".roleglobconfigrow").find(".roleglobconfiginvert").is(":checked");
        var lines=$(this).parents(".roleglobconfigrow").find(".roleglobconfiglines").val();

        $(this).parents(".roleglobsect").find(".newroleglobconfigfilter").val( filter.val() );
        $(this).parents(".roleglobsect").find(".newroleglobconfigstop").attr("checked", stop );
        $(this).parents(".roleglobsect").find(".newroleglobconfiginvert").attr("checked", invert );
        $(this).parents(".roleglobsect").find(".newroleglobconfiglines").val( lines );

      })
   )
   .append( $("<BR/>") )
   .append( $(LABEL).addClass("ns").text("Секция: ") )
   .append(
     $(INPUT)
      .addClass("roleglobconfigsection")
      .val( config["roles"][role]["global_post_config"][i]["section"] != undefined? config["roles"][role]["global_post_config"][i]["section"]:"" )
      .on("input", function() {
        if( $(this).val().match(/^[a-zA-Z0-9\-_]*$/)) {
          $(this).css("background-color", "initial");
        } else {
          $(this).css("background-color", "#FFBBBB");
          return;
        };

        var section=$(this).val();

        var index=$(this).parents(".roleglobconfigrow").index();
        var role=$(this).parents(".rolerow").prop("data-role");
        
        if(section != "") {
          config["roles"][role]["global_post_config"][index]["section"]=section;
        } else {
          delete config["roles"][role]["global_post_config"][index]["section"];
        };

        config_changed(1);
      })
   )
  ;

  var lines=add_subsection("+", "Строки", row);

  var ta= $("<TEXTAREA/>")
   .attr("wrap", "off")
   .addClass("roleglobconfiglines")
   .css("width", "900px")
   .css("font-family", "monospace")
   .css("font-size", "smaller")
   .val( config["roles"][role]["global_post_config"][i]["lines"].join("\n") )
   .on("input", function() {

     var index=$(this).parents(".roleglobconfigrow").index();
     var role=$(this).parents(".rolerow").prop("data-role");
     
     config["roles"][role]["global_post_config"][index]["lines"]=$(this).val().split("\n");

     config_changed(1);
   })
  ;
  ta.autoResize({
     maxHeight: "600px"
   })
  ;

  $(DIV)
   .append( ta )
   .appendTo( lines )
  ;

  row.appendTo(glob_sortable);
};

function regex_check_highlight(elm) {
  var re=elm.val();
  if(re == undefined) return;

  try {
    new RegExp(re);
  } catch(e) {
    elm.css("background-color", "#FFBBBB");
    return false;
  };
  elm.css("background-color", "initial");
  return true;
};

function add_role(role, cont) {
  var role_row=$(DIV)
   .addClass("rolerow")
   .css("margin-bottom", "1em")
   .prop("data-role", role)
   .append( $(LABEL).text("Роль: ") )
   .append(
     $(INPUT, { readonly: true })
      .addClass("rolename")
      .val(role)
      .css("background-color", "#EEEEEE")
   )
   .append( del_label()
     .click(function() {
       var r=$(this).parents(".rolerow").prop("data-role");
       if(r != undefined && confirm("Подтвердите удаление роли \""+r+"\"")) {
         $(this).parents(".roleslistsub").find(".newroleinput").val(r);
         $(this).parents(".rolerow").remove();
         delete config["roles"][r];

         roles_changed();
         config_changed(1);
       };
     })
   )
   .append( copy_label()
     .click(function() {
       var newrolename=$(this).parents(".roleslistsub").find(".newroleinput").val();
       $(this).parents(".roleslistsub").find(".newroleinput").css("background-color", "initial");
       if(newrolename == undefined) return;
       newrolename=newrolename.replace(/^\s*/, "").replace(/\s*$/, "");
       if(newrolename == "") return;

       if( config["roles"][newrolename] != undefined && !newrolename.match(/^[a-zA-Z0-9_\-]]+$/) ) {
         $(this).parents(".roleslistsub").find(".newroleinput").css("background-color", "#FFBBBB");
         return;
       };

       var srcrole=$(this).parents(".rolerow").prop("data-role");

       config["roles"][newrolename]=$.extend(true, {}, config["roles"][srcrole]);

       add_role(newrolename, $(this).parents(".roleslist"));

       roles_changed();

       config_changed(1);
     })
   )
  ;

  var intfilter_sect=add_subsection("+", "Фильтр по имени интерфейса", role_row)
   .addClass("intfiltersect")
  ;

  intfilter_sect
   .append( $(LABEL).text("Фильтр: ") )
   .append( $(INPUT)
     .prop("type", "text").addClass("intfilter")
     .val(config["roles"][role]["intfilter"] !== undefined ? config["roles"][role]["intfilter"]:"")
     .on("input", function() {
       if(! regex_check_highlight( $(this) )) return;
       var role=$(this).parents(".rolerow").prop("data-role");
       config["roles"][role]["intfilter"]=$(this).val();
       config_changed(1);
     }) )
  ;

  var depend_sect=add_subsection("+", "Зависимости", role_row)
   .addClass("dependsect")
  ;

  var depend_cont=$(DIV)
   .addClass("dependtable")
   .css("display", "table")
   .appendTo( depend_sect )
  ;

  var depend_sel=$("<SELECT/>")
   .addClass("roleadddepsel")
   .append( $("<OPTION/>", { value: "", selected: true }).text("") )
  ;

  var gfa=keys(config["features"]);
  gfa.sort();

  for(var i=0; i < gfa.length; i++) {
    var gf=gfa[i];
    if( config["roles"][role]["require"].indexOf( gf ) == -1) {
      depend_sel.append( $("<OPTION/>", { value: gf }).text(gf) );
    } else {
      $(DIV)
       .css("display", "table-row")
       .addClass("deprow")
       .prop("data-feature", gf)
       .append(
         $(DIV)
          .css("display", "table-cell")
          .append( $(LABEL).addClass("ns").text( gf ) )
       )
       .append(
         $(DIV)
          .css("display", "table-cell")
          .css("padding-left", "1em")
          .append(
            del_label()
             .click(del_depend)
          )
       )
       .appendTo( depend_cont )
      ;
    };
  };

  $(DIV)
   .addClass("adddependrow")
   .css("margin-top", "1em")
   .append( $(LABEL).addClass("ns").text("Добавить: ") )
   .append( depend_sel )
   .append(
     add_label()
      .click(function() {
        var newdep=$(this).parents(".adddependrow").find("select").val();
        if(newdep == undefined || newdep == "") return;
        var option=$(this).parents(".adddependrow").find("select").find(":selected");
        option.remove();
        if(config["features"][newdep] != undefined) {
          var list=$(this).parents(".dependsect").find(".dependtable");
          var check=list.find(".deprow").filter(function() { return $(this).prop("data-feature") == newdep; });
          if(check.length > 0) return;
          $(DIV)
           .css("display", "table-row")
           .addClass("deprow")
           .prop("data-feature", newdep)
           .append(
             $(DIV)
              .css("display", "table-cell")
              .append( $(LABEL).addClass("ns").text( newdep ) )
           )
           .append(
             $(DIV)
              .css("display", "table-cell")
              .css("padding-left", "1em")
              .append(
                del_label()
                 .click(del_depend)
              )
           )
           .appendTo( list )
          if( config["roles"][role]["require"].indexOf( newdep ) == -1) {
            config["roles"][role]["require"].push( newdep );
          };
        };

        config_changed(1);
      })
   )
   .appendTo( depend_sect )
  ;

  var int_sect=add_subsection("+", "Настройка интерфейса", role_row);

  int_sect.addClass("roleintsect");

  var int_sortable=$(DIV)
   .addClass("intsortable")
   .sortable({handle: ".handle", axis: "y"})
   .appendTo(int_sect)
  ;

  int_sortable.on("sortstop", function() {
    var role=$(this).parents(".rolerow").prop("data-role");
    var int_config_list=[];
    var int_conf_rows=$(this).find(".roleintconfigrow");

    for(var i=0; i < int_conf_rows.length; i++) {
      var row=$(int_conf_rows[i]);
      var old_index=row.prop("data-row-index");
      row.prop("data-row-index", i);
      int_config_list.push( $.extend( true, {}, config["roles"][role]["int_config"][ old_index ]) );
    };

    config["roles"][role]["int_config"]=int_config_list;

    config_changed(1);
  });

  for(var i=0; i < config["roles"][role]["int_config"].length; i++) {
    add_role_int_config(role, i, int_sortable);
  };

  var ta=$("<TEXTAREA/>")
   .attr("wrap", "off")
   .addClass("newroleintconfiglines")
   .css("width", "900px")
   .css("font-family", "monospace")
   .css("font-size", "smaller")
   .val( "" )
  ;
  ta.autoResize({
     maxHeight: "600px"
   })
  ;

   

  $(DIV)
   .append( $(LABEL).addClass("ns").text("Добавить:") )
   .append( $("<BR/>") )
   .append( $(LABEL).addClass("ns").text("Фильтр: ") )
   .append(
     $(INPUT)
      .addClass("newroleintconfigfilter")
      .css("width", "400px")
      .on("input", function() {
        regex_check_highlight( $(this) );
      })
   )
   .append(
     $(INPUT, { type: "checkbox" })
      .addClass("newroleintconfigstop")
   )
   .append(
     add_label()
      .click(function() {
        var newfilter=$(this).parents(".roleintsect").find(".newroleintconfigfilter");
        if(! regex_check_highlight(newfilter)) return;

        var newstop=$(this).parents(".roleintsect").find(".newroleintconfigstop").is(":checked");
        var lines=$(this).parents(".roleintsect").find(".newroleintconfiglines").val().split(/\n/);

        var role=$(this).parents(".rolerow").prop("data-role");

        var index=config["roles"][role]["int_config"].length;

        config["roles"][role]["int_config"].push({"devfilter": newfilter.val(), "lines": lines});
        if(newstop) config["roles"][role]["int_config"][index]["stop"] = 1;

        add_role_int_config(role, index, $(this).parents(".roleintsect").find(".intsortable"));

        config_changed(1);

      })
   )
   .append(
     del_label()
      .click(function() {
        $(this).parents(".roleintsect").find(".newroleintconfigfilter").val( "" );
        $(this).parents(".roleintsect").find(".newroleintconfigstop").attr("checked", false );
        $(this).parents(".roleintsect").find(".newroleintconfiglines").val( "" );
        $(this).parents(".roleintsect").find(".newroleintconfiglines").trigger("focus");
      })
   )
   .append(
     $(DIV)
      .css("margin-top", "5px")
      .append( ta )
   )
   .appendTo( int_sect )
  ;


  var glob_sect=add_subsection("+", "Настройка в общей части", role_row);

  glob_sect.addClass("roleglobsect");

  var glob_sortable=$(DIV)
   .addClass("globsortable")
   .sortable({handle: ".handle", axis: "y"})
   .appendTo(glob_sect)
  ;

  glob_sortable.on("sortstop", function() {
    var role=$(this).parents(".rolerow").prop("data-role");
    var glob_config_list=[];
    var glob_conf_rows=$(this).find(".roleglobconfigrow");

    for(var i=0; i < glob_conf_rows.length; i++) {
      var row=$(glob_conf_rows[i]);
      var old_index=row.prop("data-row-index");
      row.prop("data-row-index", i);
      glob_config_list.push( $.extend( true, {}, config["roles"][role]["global_post_config"][ old_index ]) );
    };

    config["roles"][role]["global_post_config"]=glob_config_list;

    config_changed(1);
  });

  if(config["roles"][role]["global_post_config"] != undefined) for(var i=0; i < config["roles"][role]["global_post_config"].length; i++) {
    add_role_glob_config(role, i, glob_sortable);
  };

  var ta=$("<TEXTAREA/>")
   .attr("wrap", "off")
   .addClass("newroleglobconfiglines")
   .css("width", "900px")
   .css("font-family", "monospace")
   .css("font-size", "smaller")
   .val( "" )
  ;
  ta.autoResize({
     maxHeight: "600px"
   })
  ;

   

  $(DIV)
   .append( $(LABEL).addClass("ns").text("Добавить:") )
   .append( $("<BR/>") )
   .append( $(LABEL).addClass("ns").text("Фильтр: ") )
   .append(
     $(INPUT)
      .addClass("newroleglobconfigfilter")
      .css("width", "400px")
      .on("input", function() {
        regex_check_highlight( $(this) );
      })
   )
   .append( $(LABEL).addClass("ns").text(" Стоп: ") )
   .append(
     $(INPUT, { type: "checkbox" })
      .addClass("newroleglobconfigstop")
   )
   .append(
     add_label()
      .click(function() {
        var newfilter=$(this).parents(".roleglobsect").find(".newroleglobconfigfilter");
        if(! regex_check_highlight(newfilter)) return;

        var newsectionelm=$(this).parents(".roleglobsect").find(".newroleglobconfigsection");

        if(! newsectionelm.val().match(/^[a-zA-Z0-9\-_]*$/)) {
          newsectionelm.css("background-color", "#FFBBBB");
          return;
        };

        var newsection=newsectionelm.val();

        var newstop=$(this).parents(".roleglobsect").find(".newroleglobconfigstop").is(":checked");
        var lines=$(this).parents(".roleglobsect").find(".newroleglobconfiglines").val().split(/\n/);

        var role=$(this).parents(".rolerow").prop("data-role");

        if(config["roles"][role]["global_post_config"] == undefined) {
          config["roles"][role]["global_post_config"] = [];
        };

        var index=config["roles"][role]["global_post_config"].length;

        config["roles"][role]["global_post_config"].push({"devfilter": newfilter.val(), "lines": lines});
        if(newstop) config["roles"][role]["global_post_config"][index]["stop"] = 1;

        if(newsection != "") config["roles"][role]["global_post_config"][index]["section"]=newsection;

        add_role_glob_config(role, index, $(this).parents(".roleglobsect").find(".globsortable"));

        config_changed(1);

      })
   )
   .append(
     del_label()
      .click(function() {
        $(this).parents(".roleglobsect").find(".newroleglobconfigfilter").val( "" );
        $(this).parents(".roleglobsect").find(".newroleglobconfigsection").val( "" );
        $(this).parents(".roleglobsect").find(".newroleglobconfigstop").attr("checked", false );
        $(this).parents(".roleglobsect").find(".newroleglobconfiglines").val( "" );
        $(this).parents(".roleglobsect").find(".newroleglobconfiglines").trigger("focus");
      })
   )
   .append( $("<BR/>") )
   .append( $(LABEL).addClass("ns").text("Секция: ") )
   .append(
     $(INPUT)
      .addClass("newroleglobconfigsection")
      .on("input", function() {
        if( $(this).val().match(/^[a-zA-Z0-9\-_]*$/)) {
          $(this).css("background-color", "initial");
        } else {
          $(this).css("background-color", "#FFBBBB");
        };
      })
   )
   .append(
     $(DIV)
      .css("margin-top", "5px")
      .append( ta )
   )
   .appendTo( glob_sect )
  ;


  role_row.appendTo( cont );
};

function roles_changed() {
  var template_rows=$(".templaterow");
  for(var ti=0; ti < template_rows.length; ti++) {
    var int_roles_rows=$( template_rows[ti] ).find(".templateintrow");
    var int_new_row_sel=$( template_rows[ti] ).find(".templateintrolessel");

    for(var ri=0; ri < int_roles_rows.length; ri++) {
       var role=$(int_roles_rows[ri]).find(".role").prop("data-role");
       if(config["roles"][role] == undefined) {
         $(int_roles_rows[ri]).css("background-color", "#FFBBBB");
       } else {
         $(int_roles_rows[ri]).css("background-color", "initial");
       };
    };

    var opts=int_new_row_sel.find("option").filter(function() { var r=$(this).val(); return config["roles"][role] == undefined; });
    opts.remove();

    for(var role in config["roles"]) {
      var opts=int_new_row_sel.find("option").filter(function() { return $(this).val() == role; });
      if(opts.length == 0) {
        $("<OPTION/>", {value: role})
        .text(role)
        .appendTo( int_new_row_sel )
        ;
      };
    };
  };
};

function config_loaded() {
  var te=$("#te");
  te.empty();

  $(DIV)
   .css("margin-bottom", "1em")
   .append( $(DIV)
     .append( $(LABEL).text("Автосохранение: ") )
     .append( $(INPUT, {"type": "checkbox", "id": "autosave", "checked": !g_readonly})
       .click(function() { return !g_readonly; })
       .on("change", function() {
         if($(this).is(":checked")) {
           config_changed(1);
         };
       })
     )
     .append( $(LABEL, {"id": "autosave_ind"})
       .addClass("ui-icon")
       .addClass("ui-icon-save")
       .css({"margin-left": "0.5em", "color": "gray"})
     )
     .append( $(LABEL, {"id": "autosave_name"}).text(g_config_name).css({"margin-left": "0.5em"}) )
     .css({"margin-bottom": "0.1em"})
   )
   .append(
     $(LABEL)
      .addClass("ns")
      .css("border", "1px black solid")
      .css("border-radius", "5px")
      .css("padding-left", "5px")
      .css("padding-right", "5px")
      .css("margin-right", "5px")
      .text("Показать/Скрыть код")
      .click(function() {
        $("#configtext").toggle();
      })
   )
   .append(
     $(LABEL)
      .addClass("ns")
      .css("border", "1px black solid")
      .css("border-radius", "5px")
      .css("padding-left", "5px")
      .css("padding-right", "5px")
      .css("margin-right", "5px")
      .text("Копировать код в буфер")
      .click(function() {
        let elm=$(this);
        try {
           navigator.clipboard.writeText($("#configtext").text()).then(
             function() {
               /* clipboard successfully set */
               elm.css({"background-color": "lightgreen"});
               setTimeout(function() {
                 elm.css({"background-color": "white"});
               }, 300);
             },
             function() {
               /* clipboard write failed */
               window.alert('Opps! Your browser does not support the Clipboard API')
             }
           );
         } catch(e) {
           alert(e);
         };
      })
   )
   .appendTo(te)
  ;
  
  var dev_list=add_subsection("+", "Устройства", te);

  var dev_sortable=$(DIV, {id : "tedevtypes"}).addClass("sortable").appendTo(dev_list);
  dev_sortable.css("display", "table");
  dev_sortable.sortable();
  dev_sortable.sortable("option", "handle", ".handle");
  dev_sortable.sortable("option", "cursor", "move");
  dev_sortable.addClass("uniquekeys");




  if(config["devtypes"] != undefined) {
    for(var di=0; di < config["devtypes"].length; di++) {
      add_sortable_key(config["devtypes"][di], dev_sortable, tedevlistchange);
    };
  };

  $(DIV)
   .append(
     $(INPUT, { id: "tenewdevtype", type: "text" })
      .addClass("newvalue")
   )
   .append(
     add_label()
      .click(function() {
        var dev_type=$(this).siblings().filter("INPUT").val();
        if(dev_type != undefined && /^[a-zA-Z\-_0-9]+$/.test(dev_type)) {
          add_sortable_key(dev_type, $("#tedevtypes"), tedevlistchange);
          tedevlistchange();
          $(this).siblings().filter("INPUT").val("");
        };
      })
   )
   .appendTo( dev_list );

  dev_sortable.on("sortstop", tedevlistchange);

  var var_list=add_subsection("+", "Переменные", te);

  var tevars=$(DIV, { id: "tevars"})
   .css("display", "table")
   .sortable({handle: ".handle", axis: "y", items: ".tevarrow"})
   .appendTo(var_list);

  tevars.on("sortstop", function() {
    var rows=$(this).find(".tevarrow");
    for(var ri=0; ri < rows.length; ri++) {
      let varname = $(rows[ri]).data("varname");
      config["variables"][varname]["order"] = ri;
    };
    config_changed(1);
  });

  $(DIV)
   .css("display", "table-row")
   .addClass("ns")
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .append( $(LABEL).text("") )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .append( $(LABEL).text("Переменная") )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .append( $(LABEL).text("Название") )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .append( $(LABEL).text("RegExp") )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-left", "1em")
      .append( $(LABEL).text(" ") )
   )
   .appendTo( tevars );

  var var_list=keys(config["variables"]);
  var_list.sort(function(a,b) {
    if(config["variables"][a]["order"] != config["variables"][b]["order"]) {
      return (config["variables"][a]["order"] - config["variables"][b]["order"]);
    };
    return String(a).localeCompare(String(b));
  });

  for(var vi=0; vi < var_list.length; vi++) {
    var varname=var_list[vi];
    $(DIV)
     .addClass("tevarrow")
     .css("display", "table-row")
     .data("varname", varname)
     .append(
       $(DIV)
        .css("display", "table-cell")
        .append(handle_label())
     )
     .append(
       $(DIV)
        .css("display", "table-cell")
        .css("padding-left", "1em")
        .append(
          $(INPUT, { readonly: true, value: varname })
           .css("background-color", "#EEEEEE")
        )
     )
     .append(
       $(DIV)
        .css("display", "table-cell")
        .css("padding-left", "1em")
        .append(
          $(INPUT, { value: config["variables"][varname]["name"] })
           .on("input", function(){tevalidatevars();})
        )
     )
     .append(
       $(DIV)
        .css("display", "table-cell")
        .css("padding-left", "1em")
        .append(
          $(INPUT, { value: config["variables"][varname]["check"] })
           .on("input", function(){tevalidatevars();})
           .css("width", "600px")
        )
     )
     .append(
       $(DIV)
        .css("display", "table-cell")
        .css("padding-left", "1em")
        .append(
          del_label()
           .click( tedelvar )
         )
     )
     .appendTo( tevars )
    ;
  };

 $(DIV)
   .addClass("tenewvarrow")
   .css("display", "table-row")
   .append(
     $(DIV)
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-top", "1em")
      .css("padding-left", "1em")
      .append(
        $(INPUT)
         .on("input", function(){tevalidatevars();})
      )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-top", "1em")
      .css("padding-left", "1em")
      .append(
        $(INPUT)
         .on("input", function(){tevalidatevars();})
      )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-top", "1em")
      .css("padding-left", "1em")
      .append(
        $(INPUT)
         .css("width", "600px")
         .on("input", function(){tevalidatevars();})
      )
   )
   .append(
     $(DIV)
      .css("display", "table-cell")
      .css("padding-top", "1em")
      .css("padding-left", "1em")
      .append(
        add_label()
         .click(function(){
           teaddnewvar();
         })
       )
   )
   .appendTo( tevars )
  ;

  var te_list=add_subsection("+", "Шаблоны", te);

  te_list.addClass("templatessubsection");

  var te_cont=$(DIV)
   .addClass("templateslist")
   .appendTo(te_list);

  for(var template in config["templates"]) {
    add_template(template, te_cont);
  };

  $(DIV)
   .addClass("newtemplaterow")
   .css("margin-top", "1em")
   .append(
     $(LABEL)
      .addClass("ns")
      .text("Добавить шаблон: ")
   )
   .append(
     $(INPUT)
   )
   .append(
     add_label()
      .click(function() {
        var template=$(this).parents(".newtemplaterow").find("input").val();
        $(this).parents(".newtemplaterow").find("input").css("background-color", "initial");
        if(template == undefined || template.match(/^\s*$/)) return;
        template=template.replace(/^\s+/, "").replace(/\s+$/,"");

        var templatenames=$(this).parents(".templatessubsection").find(".templatename").filter(function() { return $(this).val() == template });
        if(templatenames.length > 0 || !template.match(/^[a-zA-Z0-9_\-]+$/)) {
          $(this).parents(".newtemplaterow").find("input").css("background-color", "#FFBBBB");
          return;
        };

        config["templates"][template]={};
        config["templates"][template]["description"]="";
        config["templates"][template]["devfilter"]="";
        config["templates"][template]["default"]=0;
        config["templates"][template]["order"]=100;
        config["templates"][template]["variables"]={};
        config["templates"][template]["global_features"]=["INTERFACES"];
        config["templates"][template]["interfaces"]=[];

        add_template(template, te_cont);

        config_changed(1);

      })
   )
   .appendTo( te_list )
  ;

  var gf_list=add_subsection("+", "Части общей конфигурации устройства", te);
  gf_list.addClass("globalfeaturessect");

  var gf_cont=$(DIV)
   .addClass("globalfeaturescont")
   .appendTo( gf_list )
  ;

  for(var gf in config["features"]) {
    add_global_feature(gf, gf_cont);
  };

  $(DIV)
   .append( $(LABEL).text("Добавить: ").addClass("ns") )
   .append(
     $(INPUT)
      .addClass("newglobalfeaturename")
   )
   .append(
     add_label()
      .click(function() {
        if(!new_feature_check()) {
          return;
        };

        var fsect=$(this).parents(".globalfeaturessect");
        var newgfelm=fsect.find(".newglobalfeaturename");
        var newgf=newgfelm.val().replace(/^\s+/, "").replace(/\s+$/, "");

        config["features"][newgf]=[];

        add_global_feature(newgf, fsect.find(".globalfeaturescont"));
        newgfelm.val("");

        features_changed();

        config_changed(1);

      })
   )
   .appendTo( gf_list )
  ;


  var role_list=add_subsection("+", "Роли интерфейсов", te);
  role_list.addClass("roleslistsub");

  role_list.append( $(LABEL).text("Используйте переменную %INTNAME% в строках, для подстановки имени интерфейса").css("font-size", "smaller") );

  var role_list_cont=$(DIV)
   .addClass("roleslist")
   .appendTo( role_list )
  ;

  for(var role in config["roles"]) {
    add_role(role, role_list_cont);
  };

  $(DIV)
   .append( $(LABEL).addClass("ns").text("Добавить роль: ") )
   .append(
     $(INPUT)
      .addClass("newroleinput")
   )
   .append(
     add_label()
      .click(function() {
         var newrolename=$(this).parents(".roleslistsub").find(".newroleinput").val();
         $(this).parents(".roleslistsub").find(".newroleinput").css("background-color", "initial");
         if(newrolename == undefined) return;
         newrolename=newrolename.replace(/^\s*/, "").replace(/\s*$/, "");
         if(newrolename == "") return;
  
         if( config["roles"][newrolename] != undefined && !newrolename.match(/^[a-zA-Z0-9_\-]]+$/) ) {
           $(this).parents(".roleslistsub").find(".newroleinput").css("background-color", "#FFBBBB");
           return;
         };

         config["roles"][newrolename]={};
         config["roles"][newrolename]["require"]=[];
         config["roles"][newrolename]["int_config"]=[];
         config["roles"][newrolename]["global_post_config"]=[];

         add_role(newrolename, $(this).parents(".roleslistsub").find(".roleslist"));

         roles_changed();

         config_changed(1);
      })
   )
   .appendTo( role_list )
  ;

};

$( document ).ready(function() {
  body=$("body");

  run_query({"action": "load_config", "name": "default"}, function(data) {

    g_config_name = "default";
    if(data["ok"]["can_write"] === true) {
      g_readonly = false;
    };

    try {
      config=JSON.parse( data["ok"]["config"] );

      if(config["features"] == undefined) {
        config["features"] = { "INTERFACES":[] };
      };

      if(config["features"]["INTERFACES"] == undefined) {
        config["features"]["INTERFACES"] = [];
      };

      if(config["devtypes"] == undefined) {
        config["devtypes"] = [];
      };

      if(config["variables"] == undefined) {
        config["variables"] = {};
      };
      if(config["templates"] == undefined) {
        config["templates"] = {};
      };

      if(config["roles"] == undefined) {
        config["roles"] = {};
      };



    } catch(e) {
      config={};
      config["devtypes"]=["Ошибка загрузки конфигурации"];
      config["variables"]={};
      config["templates"]={};
      config["roles"]={};
      config["features"]={ "INTERFACES":[] };
    };

    for(var _template in config["templates"]) {
      if(config["templates"][_template]["global_features"] == undefined) {
        config["templates"][_template]["global_features"] = ["INTERFACES"];
      } else if( config["templates"][_template]["global_features"].indexOf("INTERFACES") < 0 ) {
        config["templates"][_template]["global_features"].push("INTERFACES");
      };
    };


    var te=$(DIV, { id: "te"})
     .css("margin-top", "1em")
     .css("margin-left", "1em")
     .css("margin-bottom", "1em")
     .append( $(DIV, { id: "temessage"}).css("height", "1em").css("color", "red") )
     .hide();

    var server_list=$("<SELECT/>", { id: "serverconfigsel"})
     .css("margin-left", "1em")
     .append( $("<OPTION/>", { value: ""}).text("") )
     .on("change", function() {
       $("#saveloadname").val( $(this).val() );
     })
     .val("")
    ;

    for(var idx in data["ok"]["configs_list"]) {
      $("<OPTION/>", { value: data["ok"]["configs_list"][idx] })
       .text(data["ok"]["configs_list"][idx])
       .appendTo( server_list )
      ;
    };

    var save_load=$(DIV, { id: "saveload"})
     .css("margin-bottom", "1em")
     .css("margin-top", "1em")
     .append(
       $(DIV)
        .css("border", "1px gray solid")
        .css("margin", "1em")
        .css("padding", "5px")
        .css("display", "inline-block")
        .append(
          $(DIV)
           .append( $(LABEL).addClass("ns").text("Идентификатор: ") )
           .append( $(INPUT, { type: "text", id: "saveloadname", value: "default"}) )
           .append( server_list )
           .append(
             del_label()
               .click(function() {
                 var server_list_option=$("#serverconfigsel").find(":selected");
                 var conf_name=server_list_option.val();
                 if(conf_name == undefined || conf_name == "") return;
                 if(confirm("Подтвердите удаление конфигурации \""+conf_name+"\" на сервере.")) {
                   run_query({"action": "del_config", "name": conf_name}, function(qres) {
                     server_list_option.remove();
                   });
                 };
               })
           )
        )
        .append(
          $(DIV)
           .css("margin-top", "5px")
           .append(g_readonly ? $(LABEL) :
             $(LABEL)
              .addClass("ns")
              .css("border", "1px black solid")
              .css("border-radius", "5px")
              .css("padding-left", "5px")
              .css("padding-right", "5px")
              .css("margin-right", "5px")
              .text("Сохранить как")
              .click(function() {
                var elm = $(this);
                var conf_str=JSON.stringify( config, undefined, 2 );
                var conf_name=$("#saveloadname").val();
                if(conf_name == undefined) {
                  alert("undefined conf_name");
                  return;
                };
                conf_name = String(conf_name).trim();
                if(!/^\S/.test(conf_name)) {
                  alert("bad conf_name");
                  return;
                };

                run_query({"action": "save_config", "name": conf_name, "config": conf_str}, function(res) {
                  var server_list=$("#serverconfigsel");
                  var found = false;
                  server_list.find("OPTION").each(function() {
                    if( $(this).val() == conf_name ) {
                      found = true;
                      return false;
                    };
                  });
                  if(!found) {
                    server_list.append( $("<OPTION/>", { value: conf_name }).text(conf_name) );
                  };

                  server_list.val(conf_name);
                  g_config_name = conf_name;
                  $("#autosave_name").text(conf_name);
                  $("#autosave_ind").css("color", "gray");
                  elm.animateHighlight("lightgreen", 200);
                });

              })
           )
           .append(
             $(LABEL)
              .addClass("ns")
              .css("border", "1px black solid")
              .css("border-radius", "5px")
              .css("padding-left", "5px")
              .css("padding-right", "5px")
              .css("margin-right", "5px")
              .text("Загрузить с сервера")
              .click(function() {
                var conf_name=$("#saveloadname").val();
                if(conf_name == undefined) {
                  alert("undefined conf_name");
                  return;
                };

                run_query({"action": "load_config", "name": conf_name, "empty_fail": "1"}, function(res) {

                  var conf_str=res["ok"]["config"];
                  try {
                    var cnf=JSON.parse( conf_str );
                    config=cnf;
                    if(config["features"]["INTERFACES"] == undefined) {
                      config["features"]["INTERFACES"] = [];
                    };
                    for(var _template in config["templates"]) {
                      if(config["templates"][_template]["global_features"] == undefined) {
                        config["templates"][_template]["global_features"] = ["INTERFACES"];
                      } else if( config["templates"][_template]["global_features"].indexOf("INTERFACES") < 0 ) {
                        config["templates"][_template]["global_features"].push("INTERFACES");
                      };
                    };
                    g_config_name = conf_name;
                    $("#autosave_name").text(conf_name);
                    $("#autosave_ind").css("color", "gray");
                    config_loaded();
                    config_changed();
                  } catch(e) {
                    alert("Ошибка парсинга конфигурации");
                    return;
                  };
               
                });
              })
           )
        )
     )
     .append( $("<BR/>") )
     .append(
       $(DIV)
        .css("border", "1px gray solid")
        .css("margin", "1em")
        .css("padding", "5px")
        .css("display", "inline-block")
        .append(
          $(DIV)
           .append( $(LABEL).addClass("ns").text("Выбрать файл: ") )
           .append(
             $(INPUT, { type: "file", id: "file"})
              .on("change", function() {
                var reader=new FileReader();
                reader.onload=function(e) {
                  try {
                    newconf=undefined;
                    $("#fileloadbtn").css("color", "gray");
                    newconf=JSON.parse(e.target.result);
                    if(newconf["devtypes"] != undefined &&
                       newconf["variables"] != undefined &&
                       newconf["templates"] != undefined &&
                       newconf["roles"] != undefined &&
                       newconf["features"] != undefined
                    ) {
                      $("#fileloadbtn").css("color", "black");
                    } else {
                      newconf=undefined;
                      alert("Неверный формат файла");
                    };
                  } catch (err) {
                    newconf=undefined;
                    alert("Ошибка парсинга JSON");
                  };
                };
                reader.onerror=function(e) {
                  alert("Ошибка чтения файла");
                };
                reader.readAsText( this.files[0] );
              })
           )
        )
        .append(
          $(DIV)
           .css("margin-top", "5px")
           .append(
             $(LABEL, { id: "fileloadbtn"})
              .addClass("ns")
              .css("border", "1px black solid")
              .css("border-radius", "5px")
              .css("padding-left", "5px")
              .css("padding-right", "5px")
              .css("margin-right", "5px")
              .text("Загрузить из файла")
              .click(function() {
                if(newconf != undefined) {
                  config=newconf;
                  if(config["features"]["INTERFACES"] == undefined) {
                    config["features"]["INTERFACES"] = [];
                  };
                  for(var _template in config["templates"]) {
                    if(config["templates"][_template]["global_features"] == undefined) {
                      config["templates"][_template]["global_features"] = ["INTERFACES"];
                    } else if( config["templates"][_template]["global_features"].indexOf("INTERFACES") < 0 ) {
                      config["templates"][_template]["global_features"].push("INTERFACES");
                    };
                  };
                  config_loaded();
                  config_changed();
                };
              })
              .css("color", "gray")
           )
        )
     )
     .append( $("<BR/>") )
     .append(
       $(DIV)
        .css("border", "1px gray solid")
        .css("margin", "1em")
        .css("padding", "5px")
        .css("display", "inline-block")
        .append(
          $(DIV)
           .append( $(LABEL).addClass("ns").text("Имя файла: ") )
           .append( $(INPUT, { type: "text", id: "filename", value: "mkconfig.conf"}) )
        )
        .append(
          $(DIV)
           .css("margin-top", "5px")
           .append(
             $(LABEL)
              .addClass("ns")
              .css("border", "1px black solid")
              .css("border-radius", "5px")
              .css("padding-left", "5px")
              .css("padding-right", "5px")
              .css("margin-right", "5px")
              .text("Сохранить в файл")
              .click(function() {
                var filename=$("#filename").val();
                if(filename == undefined || filename == "") { 
                  filename="mkconfig.conf";
                };
                var blob=new Blob([JSON.stringify(config, undefined, 2)], {type: "text/plain;charset=utf-8"});
                saveAs(blob, filename);
              })
           )
        )
     )
     .append( $("<BR/>") )
     .append(
       $(DIV)
        .css("border", "1px gray solid")
        .css("margin", "1em")
        .css("padding", "5px")
        .css("display", "inline-block")
        .append(
          $(DIV)
           .css("margin-top", "5px")
           .append(
             $(LABEL)
              .addClass("ns")
              .css("border", "1px black solid")
              .css("border-radius", "5px")
              .css("padding-left", "5px")
              .css("padding-right", "5px")
              .css("margin-right", "5px")
              .text("Создать пустую конфигурацию")
              .click(function() {
                if(confirm("Подтвердите сборс конфигурации. Все внесенные изменения будут утеряны. При необходисомти сперва сохраните резервную копию.")) {
                  config={};
                  config["devtypes"]=[];
                  config["variables"]={};
                  config["templates"]={};
                  config["roles"]={};
                  config["features"]={};
                  $("#autosave_ind").css("color", "yellow");
                  config_loaded();
                  config_changed();
                };
              })
           )
        )
     )
     .hide()
    ;

    top_buttons=$(DIV)
     .append(
       $(LABEL, { id : "tebtn"})
        .addClass("ns")
        .css("border", "1px black solid")
        .css("border-radius", "5px")
        .css("margin-right", "5px")
        .text("Открыть редактор шаблонов")
        .click(function() {
          $("#te").toggle();
          if( $("#te").is(":visible")) {
            $("#tebtn").text("Скрыть редактор шаблонов");
          } else {
            $("#tebtn").text("Открыть редактор шаблонов");
          };
        })
     )
     .append(
       $(LABEL)
        .addClass("ns")
        .css("border", "1px black solid")
        .css("border-radius", "5px")
        .css("padding-left", "5px")
        .css("padding-right", "5px")
        .css("margin-right", "5px")
        .text("Файловые операции")
        .click(function() {
          $("#saveload").toggle();
        })
     )
     .append(
       save_load
     )
     .append(
       te
     )
     .appendTo( body );

    config_loaded();


    $(DIV, { id: "configarea" })
     .css("margin-top", "1em")
     .appendTo( body );


    $(DIV, { id: "message" })
     .css("margin-top", "1em")
     .css("margin-bottom", "1em")
     .css("color", "red")
     .text(" ")
     .css("min-height", "2em")
     .appendTo( body )
     ;

    $("<PRE/>", { id: "configtext"})
     .css("position", "absolute")
     .css("right", "0px")
     .css("top", "0px")
     .css("width", "auto")
     .css("height", "auto")
     .css("max-height", "800px")
     .css("overflow-x", "scroll")
     .css("z-index", "1")
     .css("font-size", "x-small")
     .css("background-color", "white")
     .css("border", "1px black solid")
     .css("padding", "2px")
     .css("margin", "2px")
     .appendTo( body )
     .hide()
    ;

    config_changed();

  });
});
