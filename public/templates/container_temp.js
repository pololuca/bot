export default (input) => {
    const titleName = input.title;
    let html = `
    <div class="o-bot">
            <div class="hd">
                <div class="hd-left">
                    <div class="hd-avatar">
                    </div>
                </div>
                <div class="hd-center">Welcome</div>
                <div class="hd-right">
                    <button id="hd_close_btn" class="icon-btn" title="Close" aria-label="Close">
                        <i></i>
                    </button>
                </div>
            </div>
            <div class="title">
                <div class="title-center">What can I do for you?</div>
            </div>
            <div id="chatbot">
                <div id="conversation">

                </div>

            </div>
            <div id="ft" class="ft">
                <div id="ft_typing_area">
                    <textarea id="ft_input" placeholder="Type here..."></textarea>
                    <div class="ft-send-wrap">
                        <button type="submit" id="ft_send_btn" title="Send" aria-label="Send">
                            <i></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    return html;
  };
  