function initEditor() {
  tinymce.init({
    //选择class为content的标签作为编辑器
    selector: 'textarea',
    //方向从左到右
    directionality: 'ltr',
    //语言选择中文
    language: 'zh_CN',
    //高度为400
    height: 300,
    statusbar: false,
    width: '100%',
    //工具栏上面的补丁按钮
    plugins: [
      'advlist autolink link image lists charmap preview hr anchor pagebreak spellchecker',
      'searchreplace wordcount visualblocks visualchars code insertdatetime nonbreaking',
      'save table contextmenu directionality template paste textcolor',
      'codesample imageupload'
    ],
    //工具栏的补丁按钮
    toolbar:
      'insertfile undo redo | \
       styleselect | \
       bold italic | \
       alignleft aligncenter alignright alignjustify | \
       bullist numlist outdent indent | \
       image | \
       preview | \
       forecolor emoticons |\
       codesample fontsizeselect |\
       imageupload',
    //字体大小
    fontsize_formats: '10pt 12pt 14pt 18pt 24pt 36pt',
    //按tab不换行
    nonbreaking_force_tab: true,
    //   imageupload_url: '/user/submit-image'
	file_picker_callback: function (callback, value, meta) {
        //文件分类
        var filetype='.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4';
        //后端接收上传文件的地址
        var upurl='/my/article/add/img';
        //为不同插件指定文件类型及后端地址
        switch(meta.filetype){
            case 'image':
                filetype='.jpg, .jpeg, .png, .gif';
                upurl='/my/article/add/img'; // 不同的文件类型，设置不同的上传接口
                break;
            case 'media':
                filetype='.mp3, .mp4';
                upurl='/my/article/add/img';
                break;
            case 'file':
            default:
        }
        //模拟出一个input用于添加本地文件
        var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', filetype);
        input.click();
        input.onchange = function() {
            var file = this.files[0];
			
            var formData = new FormData();
            formData.append('block_img', file, file.name );
			
			$.ajax({
				method: 'POST',
				url: upurl,
				data: formData,
				/* 注意：如果向服务器发生FormDate数据格式的ajax请求，必须要带
					contentType和processData属性，且属性值一定设置为false
				*/
				contentType: false,
				processData: false,
				success: function (res) {
					callback(res.location)
				}
			})
        };
    },
  })
}
