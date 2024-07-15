import swal from "sweetalert";

export const sweetAlertBasic = (msg, type = "success") => {
  swal(msg.title, msg.msg, type);
};

export const sweetAlertAdvance = (msg) => {
  swal({
    title: "Are you sure?",
    text: msg.msg,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      swal(msg.success, {
        icon: "success",
      });
    } else {
      swal(msg.fail);
    }
  });
};
