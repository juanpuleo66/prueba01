$(document).ready(function(){
	// $("body").addClass("page-sidebar-closed");
	// $("#pagesidebarmenu").addClass("page-sidebar-menu-closed");
});

$(document).ready(function() {
//     setInterval(function() {
//     	$(".content_1").fadeOut(1500);
// console.info('Condition to execute');
//     },3000);
});

(function(){
	// taskconfig.view.html
	$(document).on("click", "#runTask", function(){
		$("#tab_1_1_li").removeClass("active");
		$("#tab_1_1").removeClass("active in");

		$("#tab_1_2_li").addClass("active");
		$("#tab_1_2").addClass("active in");
	});

	// cuando se trabaja con una tabla y se quiere modificar los estilos de un campo se puede 
	// $(document).on("mouseenter", "#idDivTableData1", function(){
	// 	$(".classDivTableData1").css({"height":"auto", "overflow":"visible"});
	// });

	// $(document).on("mouseleave", "#idDivTableData1", function(){
	//   	$(".classDivTableData1").css({"height":"16px", "overflow":"hidden" });
	// });

	// when showing the window modal shows the content of the data that is in the tag with id="btnShow" 
	$(document).on("click", "#btnShow", function(){
	  	let recordShow = $(this).data('datashow');
		$("#recordShow1").text(recordShow);	// cambia el contenido de lo que se muestra dentro de una etiqueta textarea, p
  		$("#recordShow2").val(recordShow);	// cambia el contenido del value de la etiqueta imput text
		$("#recordShow3").text(recordShow);	// cambia el contenido de lo que se muestra dentro de una etiqueta textarea, p
	});

	// when showing the window modal shows the content of the data that is in the tag with id="btnShow2" 
	$(document).on("click", "#btnShowA", function(){
	  	let priTitleA   = $(this).data('datashow0');
	  	let recordShowA = $(this).data('datashow1');
		$("#priTitleA").text(priTitleA);	
		$("#recordShowA").text(recordShowA);

	});	

	// when showing the window modal shows the content of the data that is in the tag with id="btnShow2" 
	$(document).on("click", "#btnShowB", function(){
	  	let priTitleB         = $(this).data('datashow0');
	  	let recordTitleB      = $(this).data('datashow1');
	  	let recordShowB       = $(this).data('datashow2');
	  	let recordShowIndexB  = $(this).data('datashow3');
	  	let recordShowOptionB = $(this).data('datashow4');
		$("#priTitleB").text(priTitleB);	
		$("#recordTitleB").text(recordTitleB);
		$("#recordShowB").val(recordShowB);
		$("#recordShowIndexB").val(recordShowIndexB);
		$("#recordShowOptionB").val(recordShowOptionB);
//console.warn('priTitleB: ', priTitleB);
//console.warn('recordTitleB: ', recordTitleB);
//console.warn('recordShowB: ', recordShowB);
//console.warn('recordShowIndexB: ', recordShowIndexB);
//console.warn('recordShowOptionB: ', recordShowOptionB);
	});	

	// when showing the window modal saves the content of the data that is in the tag with id="btnDelete" 
	$(document).on("click", "#btnDelete", function(){
	  	let recordId = $(this).data('id');
  		$(".modal-body #recordId").val(recordId);
	});

	$(document).on("click", "#checkbox_1", function(){
		var check = $("#checkbox_1").prop("checked") ? true : false;
		if ( check) { 
			$(".checkboxes_b").prop("checked", "checked");
		} else {
			$(".checkboxes_b").prop("checked", "");
		}
	});

	$(document).on("click", ".querySavedCheckbox", function(){
		var dataCont = $(this).attr("data");
console.warn('dataCont: ', dataCont);

		var queryId = $(this).attr("value");
console.warn('queryId: ', queryId);
		var eqElem = "#"+$(this).attr("id");
console.warn('eqElem: ', eqElem);
		var check = $(eqElem).prop("checked") ? true : false;
console.warn('check: ', check);
		if ( check) { 
			$(".querySavedCheckbox").prop("checked", "");
			$(eqElem).prop("checked", "checked");
			$(eqElem).attr("data", queryId);

		} else {
			queryId = '';
			$(eqElem).attr("data", '');
		}
console.warn('queryId: ', queryId);
console.warn('dataCont: ', $(this).attr("data"));
	});

	$(document).on("change", "#itemsPerPage", function(){
  		var valor = $( "#itemsPerPage" ).val();
//console.info('valor: ', valor);
//alert(valor);
	});


	$(document).on("click", ".menu-toggler", function(){
//alert('www');
	});

})();
	