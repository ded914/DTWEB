using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DT.Models.DTConstructor {
    public class DTConstructorModel {
        public string CurrentFrameName { get; set; }
        public string JsonFrameTree { get; set; }
        public string JsonFrameStack { get; set; }
        public string JsonAllFrames { get; set; }
    }
}