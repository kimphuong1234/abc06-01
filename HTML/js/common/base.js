class BaseJS {
    constructor() {
        this.host = "http://api.manhnv.net";
        this.apiRouter = null;
        this.setApiRouter();
        this.initEvents();
        this.loadData();
    }

    setApiRouter() {

    }

    initEvents() {
        var me = this;
        //sự kiện click thi nhấn vào thêm ms
        $('#btnAdd').click(function () {
            //Hiển thị dialog thông tin chi tiết:
            $('.dialog-detail').show();
            $('#txtCustomerCode').focus();

            //Load dữ liệu cho các combobox:
            $('select#cbxCustomerGroup');

            //lấy dữ liệu nhóm khách hàng:
            $.ajax({
                url: me.host + ""
            })
        })

        //Load lại dữ liệu khi ấn button Load
        $('#btnRefresh').click(function () {
            //Hiểnthị customer thông tin chi tiết sau khi Load data:
            $('#table').remove('tr');
            me.loadData();

        })

        //Ẩn form chi tiết khi ấn X:
        $('#btnX').click(function () {
            //Hiển thị customer thông tin chi tiết:
            $('.dialog-detail').hide();

        })

        //Ẩn form chi tiết khi ấn hủy:
        $('#btnCancel').click(function () {
            //Hiển thị customer thông tin chi tiết:
            $('.dialog-detail').hide();

        })

        //Thực hiện lưu dữ liệu khi ấn button LƯU trên form chi tiết
        $('#btnSave').click(function () {

            //Validate dữ liệu:
            var inputvaidates = $('input[required], input[type="email"]');
            $.each(inputvaidates, function (index, input) {
                $(input).trigger('blur');
            })
            var inputNotValids = $('input[validate="false"]');
            if (inputNotValids && inputNotValids.length > 0) {
                alert("Dữ liệu không hợp lệ vui lòng kiểm tra lại.");
                inputNotValids[0].focus;
                return;
            }

            //Thu thập thông tin dữ liệu được nhập -> buid thành object
            //Lấy tất cả các control nhập liệu:
            var inputs = $('input[fieldName], select[fieldName]');
            var entity = {};
            //duyệt từng input
            $.each(inputs, function (index, input) {
                var propertyName = $(this).attr('fieldName');
                var value = $(this).val();

                //Check vs trường hợp input là radio, thì chỉ lấy value của 
                if ($(this).attr('type') == "radio") {
                    if (this.checked) {
                        entity[propertyName] = value;
                    }
                    else {
                        entity[propertyName] = value;
                    }
                }

                if (this.tagName == "SELECT") {
                    var propertyName = $(this).attr('fieldValue');
                    entity[propertyName] = value;
                }
            })
            var method = "POST";
            if (me.FormMode == 'Edit') {
                method = "PUT";
                entity.CustomerId = me.recordId;
            }
            //var customer = {
            //    "CustomerCode": $('#txtCustomerCode').val(),
            //    "FullName": $('#txtFullName').val(),
            //    "Address": $('#txtAddress').val(),
            //    "DateOfBirth": $('#dtDateOfBirth').val(),
            //    "Email": $('#txtEmail').val(),
            //    "PhoneNumber": $('#txtPhoneNumber').val(),
            //    "CustomerGroupId": $("saassaasaa").val(),
            //    "MemberCardCode": $('#txtMemberCardCode').val(),
            //}
            
            //Gọi service tương ứng thực hiện lưu dữ liệu:
            
            $.ajax({
                url: me.host + me.apiRouter,
                method: method,
                data: JSON.stringify(entity),
                contentType: 'application/json'
            }).done(function (res) {
                alert('Thêm thành công');
                $('.dialog-detail').hide();
                me.loadData();
                debugger
            }).fail(function (res) {
                debugger
            })
            //Sau khi lưu thành công:
            //  + đưa ra thông báo tshành công
            //  + ẩn form chi tiết
            //  + load lại dữ liệu

            //Hiển thị dialog thông tin chi tiết:
            

        })

        // Hiển thị thông tin chi tiết khi nhấn đúp chuột chọn 1 dòng
        $('table tbody').on('dblclick', 'tr', function () {
            $('.dialog-detail').show();
        })
        ///**
        // * validate chuyển đến hiện xanh
        // * createdby: abc (04/01/2021)
        // */
        //$('input[container]').focus(function () {
        //    $(this).addclass('border-green');
        //});
        /**
         * validate bắt buộc nhập:
         * CreatedBy: abc (04/01/2021)
         */

        $('input[required]').blur(function () {
            //Kiểm tra dữ liệu đã nhập, nếu để trống thì cảnh báo
            var value = $(this).val();
            if (!value) {
                $(this).addClass('border-red');
                $(this).attr('title', 'trường này không được để trống');
                $(this).attr('validate', false);
            } else {
                $(this).removeClass('border-red');
                $(this).attr('validate', true);
            }
            
        })

        /**
         * validate Email đúng định dạng:
         * CreatedBy: abc (04/01/2021)
         */
        $('input[type="email"]').blur(function () {
            var value = $(this).val();
            var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
            if (!testEmail.test(value)) {
                $(this).addClass('border-red');
                $(this).attr('title', 'Email không dúng định dạng');
                $(this).attr('validate', false);
            }
            else {
                $(this).removeClass('border-red');
                $(this).attr('validate', true);
            }
        })


    }
    /**
     * Load dữ liệu
     * CreatedBy: abc (29/12/2020)
     * */
    loadData() {
        var me = this;
        try {
            $('table tboby').empty();
            // lấy thông tin các cột data:
            var columns = $('table thead th');
            var getDataUrl = this.getDataUrl;
            $.ajax({
                url: me.host + me.apiRouter ,
                method: "GET",
                async: false,
            }).done(function (res) {
                $.each(res, function (index, obj) {
                    var tr = $(`<tr></tr>`);
                    //lấy thông tin dữ liệu sẽ map tương ứng vs các cột
                    $.each(columns, function (index, th) {
                        var td = $(`<td><div><span></span></div></td>`);
                        var fieldName = $(th).attr('fieldName');
                        var value = obj[fieldName];
                        var formatType = $(th).attr('formatType');
                        switch (formatType) {
                            case "ddmmyyyy":
                                td.addClass("text-align-center");
                                value = formatDate(value);
                                break;
                            case "Money":
                                td.addClass("text-align-right");
                                value = formatMoney(value);
                                break;
                            default:
                        }
                        td.append(value);
                        $(tr).append(td);
                    })
                    //debugger;
                    $('table tbody').append(tr);

                })
            }).fail(function (res) {

            })
        } catch (e) {
            //ghi log lỗi:
            console.log(e);
        }

    }
}

