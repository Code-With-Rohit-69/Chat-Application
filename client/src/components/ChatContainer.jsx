import React from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { useRef } from "react";
import { useEffect } from "react";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesDummyData]);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* header */}

      <div className="flex items-center gap-3 py-4 mx-4 border-b border-stone-500 sticky top-0 bg-transparent z-30 backdrop-blur-xl ">
        <img src={assets.profile_martin} className="w-8 rounded-full" alt="" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          Martin Johnson
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <img
          src={assets.arrow_icon}
          className="md:hidden max-w-7"
          onClick={() => setSelectedUser(null)}
          alt=""
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>

      {/* chat */}

      <div className="message-scroll-area flex-1 overflow-y-scroll px-3 pt-2 pb-2 ">
        {messagesDummyData.map((msg, index) => (
          <div
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== "680f50e4f10f3cd28382ecf9" && "flex-row-reverse"
            }`}
            key={index}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  msg.senderId === "680f50e4f10f3cd28382ecf9"
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId == "680f50e4f10f3cd28382ecf9"
                    ? assets.avatar_icon
                    : assets.profile_martin
                }
                className="w-7 rounded-full"
                alt=""
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}

        <div className="" ref={scrollEnd}></div>
      </div>

      {/* bottom area */}

      <div className="sticky bottom-0 left-0 right-0 flex items-center gap-3 py-4 px-3 mt-2 bg-transparent backdrop-blur-xl">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              className="w-5 mr-2 cursor-pointer"
              alt=""
            />
          </label>
        </div>
        <img src={assets.send_button} className="w-7 cursor-pointer" alt="" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 txet-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
