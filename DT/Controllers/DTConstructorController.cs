using DT.DTGraph;
using DT.Filters;
using DT.Models.DTConstructor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace DT.Controllers
{
    [NoCache]
    public class DTConstructorController : Controller
    {
        // GET: DTConstructor
        public async Task<ActionResult> Index()
        {
            DTConstructorModel model = new DTConstructorModel();
            using (var dtNeoHelper = new DTNeoHelper()) {
                model.CurrentFrameName = "Complaints";
                model.JsonFrameTree = await Task<string>.Factory.StartNew(() => dtNeoHelper.GetFrameTree(model.CurrentFrameName));
                model.CurrentFrameName = "Complaints";
                model.JsonFrameStack = await Task<string>.Factory.StartNew(() => dtNeoHelper.GetFrameStack(model.CurrentFrameName));
                model.JsonAllFrames = await Task<string>.Factory.StartNew(() => dtNeoHelper.GetAllFrames());
            }
            
            return View(model);
        }
    }
}