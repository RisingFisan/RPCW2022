function formatPara(entry) {
    let text = entry['para']
    let date = entry['date']
    let id = entry['_id']
    return `<li class="bg-sky-200 px-6 py-2 border border-b-0 last:border-b border-sky-300 first:rounded-t-lg last:rounded-b-lg" id=${"li_" + id}>
    <form class="flex justify-between">
        <div id=${"entry_" + id} class="w-full">
            <p id=${"para_" + id}>${text}</p>
            <textarea class="hidden resize-none px-2 w-1/2" name="para" id=${"textarea_" + id}>${text}</textarea>
            <p class="font-light text-sm pt-2 data">${date.substring(0,16).split('T').join(' ')}${entry['edited'] ? "<span> (Editado)</span>" : ""}</p>
        </div>
        <div class="flex gap-3 text-xl">
            <div class="edit cursor-pointer" id=${'edit_' + id}>✏️</div>
            <div class="apply cursor-pointer hidden" id=${'apply_' + id}>✅</div>
            <div class="return cursor-pointer hidden" id=${'return_' + id}>⬅️</div>
            <div class="delete cursor-pointer" id=${'delete_' + id}>❌</div>
        </div>
    </form>
</li>`
}

function toggleEditMode(id, enable) {
    $("#textarea_" + id).css("display", enable ? "block" : "none")
    $("#apply_" + id).css("display", enable ? "block" : "none")
    $("#return_" + id).css("display", enable ? "block" : "none")
    $("#para_" + id).css("display", enable ? "none" : "block")
    $("#delete_" + id).css("display", enable ? "none" : "block")
    $("#edit_" + id).css("display", enable ? "none" : "block")
}

$(function(){
    $.get('http://localhost:7709/paras', function(data) {
        data.forEach(p => {
            $("#paraList").prepend(formatPara(p))
        })
    })

    $("#paraList").on("click", ".edit", function(event) {
        let id = event.target.id.split('_')[1]
        toggleEditMode(id, true)
    })
    
    $("#paraList").on("click", ".return", function(event) {
        let id = event.target.id.split('_')[1]
        toggleEditMode(id, false)
    })
    
    $("#paraList").on("click", ".apply", function(event) {
        let id = event.target.id.split('_')[1]
        $.get("http://localhost:7709/paras/" + id, data => {
            data['para'] = $('#textarea_' + id).val()
            let previousEdit = data['edited']
            data['edited'] = true
            $.ajax({
                url: 'http://localhost:7709/paras/' + id,
                method: 'PUT',
                data: data,
                success: function(result) {
                    toggleEditMode(id, false)
                    $("#para_" + id).text(data['para'])
                    $("#entry_" + id).children('.data').append(!previousEdit ? "<span> (Editado)</span>" : "")
                }
            })
        })
    })
    
    $("#paraList").on("click", ".delete", function(event) {
        let id = event.target.id.split('_')[1]
        $.ajax({
            url: 'http://localhost:7709/paras/' + id,
            method: 'DELETE',
            success: function(result) {
                $("#li_" + id).remove()
            }
        })
    })

    $("#addPara").click(function() {
        $.post("http://localhost:7709/paras", $("#myParaForm").serialize(), result => {
            $('#paraList').prepend(formatPara(result))
            $('#paraText').val("")
            alert("Record inserted: " + JSON.stringify(result))
        })
    })
})