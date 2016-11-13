using DT.DTGraph;
using DT.Models.DTConstructor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DT.Controllers
{
    public class DTConstructorController : Controller
    {
        // GET: DTConstructor
        public ActionResult Index()
        {
            DTConstructorModel model = new DTConstructorModel();
            using (var dtNeoHelper = new DTNeoHelper()) {
                model.JsonFrameTree = dtNeoHelper.GetFrameTreeForConstructor("Complaints");
            }
            
            return View(model);
        }
    }
}