using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PortableRecipes.Models;

namespace PortableRecipes.Data
{
  public static class PortableRecipesContextSeeds
  {
        static Action seed_Americans = null;
    static American[] Americans = null;
     static Action seed_Meals = null;
    static Meal[] Meals = null;
     static Action seed_Asians = null;
    static Asian[] Asians = null;
     static Action seed_Recipess = null;
    static Recipes[] Recipess = null;
     static Action seed_Lunches = null;
    static Lunch[] Lunches = null;
     static Action seed_Users = null;
    static User[] Users = null;
     static Action seed_HomePages = null;
    static HomePage[] HomePages = null;
     static Action seed_Admins = null;
    static Admin[] Admins = null;
     static Action seed_Dinners = null;
    static Dinner[] Dinners = null;
     static Action seed_Mediterraneans = null;
    static Mediterranean[] Mediterraneans = null;
     static Action seed_Breakfasts = null;
    static Breakfast[] Breakfasts = null;
     static Action seed_Categoriess = null;
    static Categories[] Categoriess = null;
     static Action seed_Ratings = null;
    static Rating[] Ratings = null;

    public static void InitializePagesAndSingletons(PortableRecipesContext context) {
      context.Database.EnsureCreated();
      
      if (!context.HomePage.Any()) {
        var root = new HomePage() { CreatedDate = DateTime.Now,  };
        HomePages = new [] {root};
        context.HomePage.Add(root);
        context.SaveChanges();
      } else {
        HomePages = context.HomePage.ToArray();
      }
      seed_HomePages = () => {};
        
    }

    public static void Initialize(PortableRecipesContext context)
    {
      var white_pixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII=";
      var cute_image = "data:image/gif;base64,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";
      var hoppinger_logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtMAAAEfCAYAAACDNkpjAAAAAXNSR0IArs4c6QAANstJREFUeAHt3QmcHGWd//F6quciIVyBcJiEiRzJTM9MEsIiQVxYBDHusqIQk3Atyyru4s3uquu6OngjIuCueLvq+l+EiKDuGnE94gERMSSZTE8HxUxCQDNJCOSaJNNd9fy/lTuTmel6evqc+fTrlcxM13O+q6v7V08/9ZTn8UAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAgvoCJn5SUCAwu0NTUMk9b3zB4iiO31NSY9pV6HLmFZxCoDIFZs2aN6e3te5XnhedYY44zxmw01jw2YcIJP1+8eHG2MlpJKxCoLoHJa+e/8qbJ037WbtrD6mo5rUVgYIGagZ/mWQTcBIyxzaH1Xu+SKwj8e13SkxaBUgo0N7e+dkfvrug1etqeeq31bPRPf/T0bOpsamt7U7qj49elbBN1IVDtAi/dfPOxfS9uue8ra1e9V335arX3h/YjEAn4MCCAAAIIHC4wrbnl86ENH9azewPpwzcroLYtNhM8Oi3Z+oF+m/gTAQSGEMhs2dKuzSfpzPSjUzfeNG6IpGxCoGoECKarZlfRUAQQKIWApixdrw/6N8eoy/fC8DaNYF8bIy1JEBj1Ai99dt7ZnjVviSD0Jc8pO7fveP+oRwFgRAgQTI+I3UgnEECgEAIzZ848SaPOn3UpS+nvTCbn1rnkIS0Co1GgL2Pu1vFSu7/vCqjfMemZeWfs/5ufCFSrAMF0te452o0AAgUX2NmXfZ0KdfrqWfOoTw5N+rKCN4YCERhBApO6r7lcw9FzDu2Srj+o9wJz56HP8TsC1ShAMF2Ne402I4BAcQSsTeZVsDUteeUjEwKjQOBi267FDsK7BuqqTkZfG63uMdA2nkOgWgQIpqtlT9FOBBAouoAx3oGvoJ0qCy0rIzmBkXg0Caxe89RbFTQ3DdZnG9i75toHEoNt53kEKl2AYLrS9xDtQwCBEgrY3+VTmdafzitfPnWRB4FqEpj27A3jNU96yFVvNN2j9ddrH4pz0W81dZ22jiIBgulRtLPpKgII5BAI6x5SYJzJkar/5m3GjF/U/0n+RgABz9uR6fuwRqWPz2WhNB+avPaanOlylcN2BMohQDBdDnXqRACBihRIp5et1UVSTst1+cbclkot3l6RHaJRCJRRYNIz17doVPrmWE2wdnwYhu2x0pIIgQoTIJiusB1CcxBAoLwCXV2ddxjP/G+cVmgU+6up1MpPx0lLGgRGnUC27y7d4Sj+XGhrb2nsXjBt1DnR4aoXIJiu+l1IBxBAoJACCpDtvHlX/7XxvejmElsHLts85yXMVemuzr+L0g+chmcRGL0Ck7oXXKkD41JHgZrAswOu+uFYDskRKKmAKWltVDZiBZqbk7eF1hvyIpP+nfdN4tKuro6f9H+evxGoFIG2trYJfYG90lg7UyNsx1njbfSMvyThnfB9pnZUyl6iHZUmkLTtdVu70ykF02fm07aEb/5qbeO3Yn07lE/55EGg0AIs51RoUcpDAIERI9DR0bFBnfniiOkQHUGgBALb1qx6V76BdNS8wNo7Z9mbf7TUfNH1YuAS9I4qEDhSgGkeR5rwDAIIIIAAAgjkITClZ8HJuk34+/LIejCL9aZuWLP1rQef4DcEKluAYLqy9w+tQwABBBBAoGoEsr32Y1rB45jhN9h+4Ow/Ljhx+OVQAgLFFyCYLr4xNSCAAAIIIDDiBU5fc905mt5xYyE6qtHt43buDj9SiLIoA4FiCzBnutjCo6R8vfEV5GJWXfA1Nps1jb4fHGut3xAmvBd1f+cXfN9/Yfny5S+WmzOZnFsX1Pyu0fSFp3iePVXt0U/vaM+3PZ4xf7LGrE+EDc+lUk+sL1dbI8MgCM4MjZnoBWpb1L59/3S7bH3Wmee1AsXzem6zZic+39DQ8PulS5f2lqu9Ub1Ns2adanZmztSNG8ZrcYwD7Q09b6zO+LfvbW+4v909nZ2dfyhne4tV96xZs2p7e4NGL5Ft9K1/bKD+Gy8Y64VmrC5+HKPX2G4daNu80GqVEbMtkbAbxo4d2/n4448PsupIsVo6dLlNTTNPTyQyL8l63gkm8KIbcZxgfXOs2r7b80K132zb3/76+vrf6fW3aegSi7e1tbX1eK1vPFk1nKLX28le6J1i9YbjW6/H+naDb+0GHSPd5Wzj7Nmzj9q2bVujjo/Jel88Rsf2mENfFzpGMnoP3qH3oR16D9qs18naRHh0dyq1RMd46R5hmL1b74sFG6TTm9Ubp6xbcG/3pPs6StcLakLAXaAgAZB7teQYaQJNTckP6Y3v31z6Fa3mYczUX4bhqkv1IfB6G3qX6I24UWUM9rr8o7Y8Zoz/WMLYbyugWudSX75pX/aylx2zZfvOvzQ2vFIfZnNUzrhcZSloTekD7WEFEA+tWrlyaa70+W6PglBv166LPGsuUhnNuuHIWdoPUZAf+6FANaM8v1GbFyvIWXzccUc/umTJkp2xC3BI2N7e7n/rwQdn+oG9OPTs+drVZ2lnR0H0WIdilM1sUL6fe8YuThjzM70W0k75h0jclGy9Xft6zBBJ+m0yf9La1B/r92TOPxU4n9jb23ehNfZCnePMUDB0hjo2ScdA/HV5D9ayRiYrFcX8oqbG/5YunHz24Kbi/9bcPH2mTsxeodfRhdqXL1eNp7nUqtfeZr2Gn5LFSv3+s9pE4qf7Lv50KSZ22qa2thabDa/QooZ/rSkJ5yljrgBQXTNLtZ8WebWJH3StWPF4MZZEjI6PBx98MJkJvdk6ls/Xqe9UnVy+VK+Nk9XGwd4XB+y32rdQSze+YcCNRXhyUvf8edr33yp40Xo9PDvlfn028ECgcgWcDs7K7QYtK7dAPsG0PhseU+DQorY7z6/TB4UGvbzvKCC/M5Va8Zti9D8Kdnbs3PVRHSQ36sOsLt861NY/+Ma+J5VKPZhvGYfmSyaTfxZ65lqNTs7RJ/zZh24r0O+bdNOSu8eMqf8PjcZtGW6Ze79tsFeGXviGvUG/PXa4ZfbPrwDsV3otfDSV6vhh/22ufzc1t7ygoOC4uPlUd1e6K5XMlV5lGo2Czg6s9wa9ni5XsFSsm1NEgd/PPd//4qpUx3252pXv9mgUfdeuvrlBaG/VcTwr33IGyRf1odM3OsZ97yuFOnFOJtteHYThJ9Xe1kHqjfe0MSt0Qh8d04/EyzB4qn0nxK/TiexrFdjrBNP9/XCg0o3v35pOrSzJms2N3Tc2ZL1dq/SaPn2gtgz3uYTvXbW28f7vDLcc8iNQLAGC6WLJjrJy81lnukBEiivNJ06ZcOIHFy9eHAXYw35cfPHFNRs2bLpFn+a3uQRVOSvWCGptwrxjpR450w6QQDH0KYHd+T19YP3ZAJuL8JTZorGwz449qv6j+U4DaUomb1AAfbcco6/6S/AwSxO+//7hBNXFCKbl8E7F0v+ofTexBAgHqlCg/0uvJnFLuqOj88CTw/wlOilIJlvfqikR7y5RfzSrwXtkzFENV+f9Otw7Ev0ptffyYXb/8OzG+2nC1L0tlVrWdfiG3H9pdPwcLxvcoxOrC5Q618h47gL7pTC1idna77/u93RR/pzYPe8DGkW/rSiFq1Dt/+76xglNT5t/1zQhHghUnkDBD+DK6yItKoWAPhDKdWLm6wPyfT0bNv4sGgEdbl9nzJhx3PqeTT8PrdWHXPzRyVj1WvsXmaxd1tzcclOs9P0SGbNzgvpaokA6qlwjyLLt3bnrUbk09mtOrD8Vd11QukA6apKdFYTBD5qSLR+JvjKP1chSJArNa2RZ0kB6j4b1XuFlw+g1d10hujlz5syTZPsDHR+fKWF/NG3Zi6ZXOUy9OdjbPSd0MlB7CxtI7wH2LgnCzGMa8b7kYI3xfjPZsFn9ulCpi/E63e0HU5+M15LhpZq47oaXKNx99/BKGTq3nKb0rdmkb0B4IFCZAsU4iCuzp7SqqAIaOdBAbvke0YdSJht+czgBVEtLy8m7+rKLFZBFI0VFetiEApEvT0u2Vs0Hg2xn7N6d+W0+AUOREHMVqynP9l/vv//b39NUhIJPKclVeaVt18lMje5O+jWNJl8znLbp+LhY0zpW6Eh/9XDKKWVeTT97t67F+FpkULx67bGhDRY1N7deW7w63ErWNK0nU6mFfW658kttsn2f1InKsAcyctUe2vB9Wi3E6XqQXGWyHYFCCRBMF0pylJejgKtcI9MH5PWBeeX99y9834EnHH7RiNtpmvv5S30oTHfIlm9S44XhnQqoP5BvAaXOpzOl8fowe6SKAmrFfPYvd/Tu/vGcOXPqS+1VefXZhF7f35jW2prX3GZNSTg/G9hFeh1UTTCjQPoTau/t2hdFf2/S+1+djo//amppuawS9r0uWlxSinY0dl97vo6zBaWoS3UcHdrsx0tUF9Ug4CRAMO3EReLBBMo9Mr2/XfrwfPe0884bv//vOD8VhJudu/v+Sx+IZ8VJX7A0YXhbdEFUwcorckHR6F5gw/uiE48iV1XA4u253Wuf+UwBC6ziorRKSFbTMxwf0TJ3mirysLI1OGYtW3IFta/Te8F7StwAnSTbb0RTYUpc7xHVGZMoejAdvW8GNrhHZ61FP1nZ30EF7jdMemb+ufv/5icClSJAMF0pe6LK21EJI9P7CMf523v/0YVTX8++XR8Il7jkKVRaze/9SjI5+4RClVf0cqydsHN35oHoIs2i11WoCqx38555s4Uqr6rLsRdoNZir4nYhmbz4aOtlvq/AKVqarSoe06dPf4kX2C+Vo7F6Hzxl1+7M18pR96F11tSYogfTp3dfe72C22hZwdI9FLjbwLundBVSEwLxBAim4zmRKodApYxMR83UG3zsuYtaqmyaRrDK+dXhaaG37d4cvJW1WesI9/RseldlNSpHa6z5XCWMGOZoZUk2a2m++XErsnbTP+mIGt4ycnErK1C6vkz26zqmnb6d2lO1lrvTXOMva+mIj+nfZ7Sk5Y/1L+PaLJ14vKac06HU5nUrVqx4zrXdLunb1l+vmwiF5XnftPaCiWvmD2v+v0tfSYtAHIHqGV2K0xvSlE1geCPTZqfm+HVrauMaBcIN+s7wDJWnm1fkd5W78k5OJs85M5V68ulcIJoHepuChaNypTtyuwnUzkWeb5ZHd6PT3ekmKYr/K5U15ci0Qz+ji+XmaU7qJ7WMVcGvvtdJzmYFFt/TzxVqxXrdHW27sfYUfUPbpp9Xa1uec2Dtu3Q3yHuKcZFTdPGUXg8/Co3fnfDMegUn9frgfol8X6XXyKX6WzfFdHsozxhdPPc25aqaeep7ehjdnMbu2Xd/0tHQo9facQr0puo1rrn9ea7Xbc1l0RrRWmZuyEAxujOgLurN86RJx4eWs9Mx8v3Q91YnbOJF3WVQ68nb8TpW2nS98lz1oeDTqpqb216piwFf6fLqUDu/W1uTeI9uEvNU/3zRRcnZ0Nypaylin6BHZaiv0QXGP+1fXmH+3vN+uVSDtD16bbygG92MMdacpDHbKTI9U3UUfVT6hd7M+/ReXb7pXqF3+6w/3vzw0tO+2FsYU0pBYHgCBNPD8yP3MAT0IbZIN2X4XEND/Q/7f7BHH+TZrAIfY9+ST/AUeJlo2saQwbSW0puoYOH1zl0w5om6Gn+ePnx1AnDwoZVE3vnAAw++SRciRV9D1h/cEuO3TPB2pboxRkq3JMbcvyrVectAmebOnfsu3TjwVn0ofkjbnebDRkG4teloubWvDlT2sJ6r9f+ma+B1ke+O5u9qsPDLek1c6lyH8d6ifX679tsO57xlyFCTMC/XzUp0Y6MjH9EqJb27dt+mlSreqgDV8Y6J9tidOzPnqNTHjyz54DPZ0IsCQgXAbg8d18t8U3NTKrV8+SA579fFgVGbCz6n2Xp7gthBqj3yaQX7/6Yb7nzkyC17n5F/j367Tuvo92hFlMgj1kPH1Guib720pPyqWBliJlJ7b29snPTBRYsW7R4oS/SepueLurJGY/f8Rt3m/lad3JbxYSdu3L0tev18sIyNoGoEDggwzeMABb+UWsB40d0LU9/vH0hH7dCH0Avp9Mp3aZRybj7t0sK0jbnyZbPhLQrK3E4o9VXw8ceOu6h/IB3VpWA67Opa+QWTMM5Xt+tzab4+CCfkanMhty9cuDBIpzvvMJ5/hQKgPteyQ8/7Z/np8710j3R62dqu1MpXqdL7XGvVqN0J2uc3ueYrV/r6+vrBglFPx8yWdKrznRrhfV8+7bN+OOSool6LY20YvsO1bL2OfnPMuKMvHiKQdi0ydnqNIjfp9TgndgZj/jOdHjyQPrScCRNOeo++EYi+3Yn7MHqt3Rg3cex0vvfMYIF0VIbel57VvyNG2GOXHyNh1tpPydnp5DtGsc5JdOL0z2c8Nz/6BpMHAmUXIJgu+y6gAUMJKDj9rq4V//ZQaQbapjf7Ewd6fv9z0dfcSnPz/r9j/gwTpvaaJUuW7Bwqfbqz8yG1+WtDpRlgW70+fN84wPNFf0onLT+2xne6aHNPo3Q7bI2+lXw+reaEWt9vvtExuNnTZJ0AzCs6aAkraGlpvlNTXzpcqzShGfLELZu1f64yx7mUq/3S69m6Nzz++ONbXfIVKq1G0v9BZcU6uVNbXxh//LGxTxaiu6v6nrnDra0mMhxRj0mrr4n6FPsC1mJ2XifHR/X1Wd0angcC5RcgmC7/PhgRLdCIVNG+9PM9/wF3JDNkMB19za0GO12kpFHy78a9bXBdTeITarOTiT4cNCe4PI/W5mmfU4CRdq09sOYVrnkKkT6aq615oro4zvFh7blaiaTso2qOrR40efTtgg69RYMmGGRDrpNNzfp1n0Zj7Z3RNweDVFn0pxVFx26zDsyvPProo9tcGnX88cd8zyW9wvpzZ8+efZRTngpO3G7bfS2GF01hq5iH3jPnT1577csrpkE0ZNQKEEyP2l1f2I7rTS3WiFA+tfq+df7aUpMPctx6OLzQtS0KNr8eN0/0VauC71/HTR+l0wf8edGIuUueQqXdG5R5n3Euz+4ZwXTOVogM0Yi6BiJXOpZV39Pz/HmOeSo7ue91uTZQx8eQ05tCzzhdxKf69fKt+4prOwqVPlqpRScITXHLS5jEwrhp96fbF3xv2v93rp9qT+3WrVvPz5WuWrZ/dc2qN2ovz6i09towuEfWRfv8qbT+0p7KFCCYrsz9QqsOEdDc0bWH/FmQX/XJ7xhMm2DcuDE/c6lcsxH+zyW94pGjejOZWW55Cpe6psb/joLTwKlEa8syMr2/jcY3zkGRnMva5v1tL9RPrdCyvlBlReXohO5ErV7R5lSmMb91GpX2delxAR87MxmHfWp2NjTULMunen0Dt9olXxiaaS7pKzXtmc9fe4wuwPxwJbZPgfSsyWsX/G0lto02jR4BgunRs6+L2tNiTvNoaGgIC914jaQ7fTWowHiV61xQ65vfuLbbZEOndrmWP1R6jaZv0PcLnUOl6b9NJyWnJpN/dkr/50v1t++FP82jrnPyyFOxWRSVajcU7rFr164pKs0p2NXx/1unFoQKzQr40K344p8cG+93A130PFhztOpNIpmcNbmpqTWaL+za7hMGK7eant+9JfsBdX3IefZl7Y+1H5268SanOf5lbS+VjziBIb/qG3G9pUMISEAjb2N29O5yuuWvPkH/4IpXY8wfMs6fvbbRtZ4Cp4+Caa1hHP8RJnZH89MLOjoat3adaHVqX8ZNvjed8aL28hhEwFpfPuEgWwd+Wusddwy8pTTP6kv+aJ33WA/NMT9sqkY0RWDGjBmnZbPZRvVd/8IpWj9eP6M1401jZyo9Sb/vnX4Vs46DDbFO12UczFc5v7103TVnZTLB2yqnRUe2RIMjp+zY3vuv2vLeI7fyDALFFyCYLr4xNVSYQCaTyWO0yKx17cb48ePXrO/Z6JRNIUwebXOqYsjEmhf+lAKHIdMcsTFjy9bmaIm4puakbuzixR8d1xJ5R/SBJw4IaP87n2wY4x8WoB4orGS/GAWt8V63ip0nTmtOfkEXsE7ROvaNzcmW0/X6qdvb1H0nEQcGzrVi9LD6ELWruh99mfDT6sE+n8rti25C9c5Jz8z70rrJ9zsPfFRur2hZtQgwzaNa9hTtLJhAEAT5fMBtc22AltPSkKnjHGSvvB++ChxecO2n0pc1ONW1ry+6tFnhUVnb69LWsqT1h14JZ6A2BSbcOtDzJXvOuqzMY6cqQr5Zr4PLFESfdTCQLkJrfcebNxWhCcMpctLqeVphyP7VcMooVV69d9V7gfepUtVHPQgcKkAwfagGv48WAedgSl9j9+aHY93yOQUF+bVo6FzG+aRB88mdPYdug/NW1zaXu73OHSxxBmcffcXpfNOfAvcpnxPkAjfhyOIUqLsd/0cWUbZnLrbtNZo5f1fZGpBHxfK+8vQ1Cy7JIytZEBiWAMH0sPjIXI0CoTE5ls07sle6mDA48tncz2jahFM+BaZlXZdWd47M5u7V4Sn0AeZ26/TDsw//L+tlHAup01QGpwvsHMuv6uSycQ4AlaesF3/pAkjnY7oUO8n3bFXcun4gi6e7n/oHHdvNA22r5OfCMLx7rn0gul09DwRKJkAwXTJqKqoUAb3LOk9lMGGY54e1dc3n3LYCux7tWp5uR+g0zcK1/BjpnQI5neBs0b/hTYWN0aiqTWLM865t17nJsa55Cpx+c4HLK0hxurOo84lJQSoeZiET1/3dCcaE7cMspizZdWC3/nrNgzeXpXIqHbUCBNOjdteP3o77vu8cLGjka6yrWLSklkZ2XC/ccW6ba7uGSq+VDJyDooQXlDWQUVzs1OY854UPxTaitiU8k8/+PLOcCNqn+bS5IE3WidmLukHTk5oS8W2te36Hb8w/eAlzufFqzx7TUPf+glRS4kJMZsdteu9ynu5T4mYOWp1O7j7U2H3jcYMmYAMCBRZgNY8Cg1Jc5QskEonNXsZp9oXuYWFOc+1ZOp12zqOL6coWFOzrXx5BUU3ZRtOjW4Ov79n0krgrOezpo3X/ZsJ131d3+sD5hE7B7PTy9tk6tzlue3UiHc0HX6tjc7XmBnXr4sXVuivr6jCR6K73/dXLly8v9zczcbsSK51uz90cBtm/j5W4YhPZE7Pe7nY1750V20QaNqIECKZH1O6kM3EEzjzzzM0rO7v0+R//xhSaYXtGnLL7pXHOow/uci8x1uoUmO7psE5OyvTo2bxZczqt0/xIBURla2+ZmJyq1Ujr086vAd0JU+u317rcDMWpUTkSa2R403AWsdNxp+UVzWq9I3RriTUFy/7qwPe6a/T71Vdf/Vx7e7vbwts52lvJm20Q3K32VX9sYMO3NHYv+PyaKfetqmRv2jYyBKr/gBkZ+4FelFBg4cKFQVNTS0ofvi2xq7V2mkZBa7TcXewL9MLQU2Dq9tBM3g63HIVL/bKXveyYLVu3z3QpUYFX70knHbPGJU9B0wb2IvfyTMo9z+jJ0dnZuW5aU3KNetwYt9c6Mx2vOye+Wum/HzdPIdPpBGm52nBd3DL1uv2F9b07ErZ29THHNHQvWbJk52B55THYphH3vG7LfUUYhJeNkI7VBJ69S32ZM0L6QzcqWIA50xW8c2haEQWM9yvH0sdt2rTpPJc8CtZf6ZI+SltXV+PaLtcqBk2/bVvvFdrotjKH9Z5wOcEYtPI8N9jQXu2aVXOsl7jmGW3pNdL7C9c+6z4n7y/XKinap47ttaeu6uz8n1RqWddQgbSrQTWnT9r2ujCwd1ZzH/q3Xa/HV5++5prX9H+evxEotADBdKFFKa8qBDSS9ahrQwOtYRo3TzTKq7SOwbR5TvMv18Sto9Dp9MHzVtcyyxmYTmttnaXpCLNd21xT4z/mmmcUpncMTrUnrHdec0tbWeaonnTSScs0VWN73P2ktp6VTCYvj5t+NKTb2r3q7dqLZ420vgY2+PQse/Pe28GPtM7Rn4oRIJiumF1BQ0opkNcIsPXelExefHScdm7btuNN+sCOlXZ/ecZ3Hi3fn3XYPxVYXKWR9PNdC1IAU77ANAg/qfbqvMjhYcyzHR0dzzrkGJVJGxpqv6eO6w6ebg8bhnc2JZO35Mzl+277LUeBe74dscbptRhac1cyObtqV6zIQeK0+Yz1109Qhn9zylQtia03dcOarc4DBdXSPdpZGQIE05WxH2hFiQX2jAAb84RLtRq5PS6wmz6VK09T08zTNX/TeUks3eBhYa6yi7F92vTpZyuw+JJ72WaLVkb5qXu+4edobm5p16oKl+RR0nfyyDPqsixbtmyjTlO+kUfHjQ29z05rbvlpc3Pra2fPnn3gJkTRNQfJ5Dln6vk3e2EY+1ueuG3Qeuf/HTdtlE7Hc1MQblvc1tYWBZLDfkQXYE6fPl0ry1TfI9Pb91GdTEffpo3Qh/3A2X9ccOII7RzdqgABgukK2Ak0oTwCevF/xrlma9+sQOFfBsuXTM6arBvyfT8KvAdLM9DzGuF9prm5+eGBthXzuebmtldomcCfqL3Hu9ajebX/qVHekt7hLQrImpuTHw+t/aBre5XeerWJz+aRb1RmqatJfHqPWT69t/YvQhs+/MKLW7c3Nbesb2pOrtUShruCcPfv9fzndbJ5dj7FDpUn4U29T9v/OFSaI7fZ1r5M+ItkcvqFR26L90x0MtqUbP1w785dz+zOBF+Jl6tyUjV2XzNDd4W9qXJaVPiW6FvC43buDj9S+JIpEYG9AjVAIDBaBYxpesB4XXfojfYUJwNrP6bVQC7XigCftTaxvLY23KJb2E4OrHltaHdFX3G7f3Vs/HujVUaGaocCXvevxq09f1pLy+tNULPymGPqe+bMmbP9oYceOjWTCds0EnWjApurFGM6LS23r40aCKwtSmBqssHfatrJd2pqatbo3wbVV9vX1zc5m7WX92zY9Gbtr6ahnAbdZrxHVq1Y8btBt7PhMAGdKD3VlGx5QBd5zjtsg9sfukO9PXlvFoXQRXykUgv7piVb/12j3h93q8ZODcLsLxXwL/es+Y/aWv+RqVOn/mmg41Gj2GN1rDcF1jbrcLxAw9uXe33ZxoM9sxOi0ekVK1Y859aG8qUOvOAenWaO+IE17aM3Tlm34N7uSfd1lE+bmkeqAMH0SN2z9CunQPThqxGlez0bfihn4n4JFIhepCDhIs8Lvb7M/o0HP1L3PxPnZ3ThlO8dnXOahYJ3VeBWhwLPmV5gH9Roubdla8b71v0LowLcg/L+HTFGKyE8+XT/pwvxt1aFuFXdvDXo020X9O+wh1v3D8uaMN7dhz3BHzkFfG/cLYHZ9nIFjRNzJq6ABLW+94VMaN6r48TprphR03WszND/X+7TDZ06U+msguvnFDBHQXGdiaZAGHOstkVTQvYdPwO+GP3d2fB6pfmE/lX8Y/LqeXN1vP15xTe0EA20XiKTDaP3gEsKURxlIHCowIg/Gz20s/yOQH+Bk08af4eC1HT/50v5t/H8f0qllmwuUZ3DD6Q9s8XY2reVqL2FqcZ4/51KpR4pTGGjp5TodWmsuVY9roqblqxcufIFvcDfPNw9pBNl3a/FO13B9QX6d67C5rP3jbDnPn5Ce+Nw6y9Fft1uu8EaE13EO3oe1vuL09fMe/3o6TA9LZUAwXSppKmnIgW0CsAumzDXK6DuNwRaouYa74ddXSu/UKLaClKN1mF4azq9bG1BCitBIdq36xrqat9SgqpGZBXp9MpfGN9/uzpXFQF1Ot15v+bzf7l8O8NObWprc14Zp9TtDczOf9QJQmOp6y13fbrY+o4z7dvqy90O6h9ZAgTTI2t/0ps8BFatXLlUIzQfziPrsLJoesfmo+rr/m5YhZQ4s4KUb3V1dX6zxNXmXV10kpTwvRu0esuLeRdCRi+dWvnZhJ+I5k47L5dXDr4xY+rfoeOrqxx1R3VazfsvV91x6p30zPzTNIVl0Aup45RRrWl0AvHSvjUb3lWt7afdlSlAMF2Z+4VWlVgg3dnxYeObz5WqWn1X/HzCN5drCTLH1QdK1cIB6tFUCQUpNwywpSKfUiDdq8uqrtTtoBdXZAOrrFGpVMe3E37NZWr2mkpv+tKlS3t9M0Y3TTJLy9JWa+Zp5ZmGstQdo1ItX/gJTRIfGyPpiEyieeL/evqa604dkZ2jU2URIJguCzuVVpqAAi+bTnXeoiD39mK3TXX8yZiaixTk/bbYdRWsfGPulM91ClIOXG5ZsLKLU9AmzUW/JN3Z+b/FKX50lppKrfjVlMbJ03xj/knHzAuVrJBKPbG+rta/SN+m/E/p22mPXb9x8+tKX2/uGieuu+Y8BdLX5U45olMcHdrsx0Z0D+lcSQUIpkvKTWWVLpBOp96r+aG3qp1F+TpbXz0v0+2sL+zqWpGqdIu97TPPKRi5YVVXZxQ8Dbh8QaX1IwqeahLm/K6ujscrrW0joT2LFi3arak+d8r4DN218y16TS9Sv+IeL9uiqUJaD+OHpbCI1kFvaWm6MjpJVjv7SlHn/jpMGN64//dK+akpDsbL7lkKTySj+6EVmf5G013OHd0K9L5QAgTThZKknBEjoPmhdzXU1zbpQ/87heqUPrme943/9/PeMPdcrTiwulDlFq8cs8Xz/X85/rhxZ+mCrv8qXj2FK1nB0m80Gn2R2nuFRv3/ULiSKWkggWjljHQqdW+6K/WasWMaxpuEeZVe4zdFrxvth7v1mv+SlpP7mEax36Fjab7mrs9obWk+XvtngTF+ydb6jdaLjk6S6+tqp6od31BfinwhpQmikwWdfJbxIsiB9pjnnf7MNddq2cnzB946yp61nrGBd88o6zXdLZIA60wXCZZiq1tgz+3GPe8q3SHwldaG79QoRjRXNI8rwE231qh9QKPRt0fBR3v7ylLDRKPJMUehzEYFpI8o+FlUW5v4QRkv2ovbZl036i3XZ+KihLE/0NJ3j5Yal/r2CkRzlPXb/+Xy0D7ak0QjpM7ziYMgGNaKO/uO6b/RSht3eJnwHXqRzdGlgi/J1eaY2zWtyPxSaX/e0FC7sBKvhWhbf/3YF3b2VcX61zHNh5/M2gsmdS9YsG7KffcNvzBKGM0CBNOjee8XsO81NYmvBYH3c5cifd8ui5P+tNNO633xxW26mMjl4Rdk3WZNFfiJav1JMnnx0dZueo2CgCsVm7bqQ/hUfRifoG2HBqq7Fdytj2704Bv7Y2NqH0qlli93aXXB0xrzRQWanwu8xAwTBpNUftTmEzzf9GrSxgZr7AbfS2wIfNs9/6qrlrW3txd51C53DzV94MLA88aa0GvSl9LRTTJO8EI7RrbPW+Nv2NNuX+22Ry2N5sXmLtEthUZV/9r3vdq4ubQe8Y5caX2/5t0aEI3sYz+uuOKKXQpSc6b37bilnr/D6fhIJLzunAUXN8EUl+I1yptVgLpFP12yDZg23dHRqQ1vija26qE7a75av16qI3mS5hJPGOC4jpLue2iNdc/7g9I+rXRPJ4z5vefV/CaVWua8cogxR/04YXY77beaGvPU/pa4/uzLmgZ9c3DDYe9YroWMwPR+mHh+BHaLLpVYYPjvTCVuMNUhUCkCyeTcOt3v5WS1R4H2uJ5i33ilpaWlLRvYFS79j1YoiS6sdMlTyLTTmls+rwDlzS5lmtpE676AxyUbaatIoKm5pUsnprFvCx+dpGo6SUlWX5g7d24inU6fGIaJE8NaL3OU72+vq6vbPmfOnO2VcLJZRbuZpiIwagQYmR41u5qOFloguh25ylxX6HIpD4GRLBAtGbe+Z+NLXfqob3s2uqQfTtpojrXy9+z7d6Coxx/netYDGPyCAAKHCXAB4mEc/IEAAgggUEyBno0bo2XZnK4/0FeoBZ/OU8w+UjYCCIwuAYLp0bW/6S0CCCDgLBDdHjuZnDHDOWO/DG1tbRN1w5CP93s655/WN7/KmYgECCCAQJkEmOZRJniqRQABBKpFwGbD9sAGl09rannM+Pb/+V79j1KpJ592ab/m/J/blwkfUJ4TXfJFabXs3o9c85AeAQQQKJUAwXSppKkHAQQQqEIBjSZPUBB86d6m2ws0snxB4O32FFh368LAJzQFI61VYVZpZYtnAt/f6mUS28aM8Xfs2uWNCfy+k/zAO9d64Wt18Wy0aobzRe9awePFlqlTn9BFqVWoR5MRQGA0CBBMj4a9TB8RQACBPAUygZ2rpSATR2a3U7Qs4BQtEafNnpeN/tP6mPrP2xGtOh09tNDicNda1BrvD++7KHBvmfyPAAIIVJgAwXSF7RCagwACCFSSgA3tNeVqT7S+tO6c+JFy1U+9CCCAQBwBLkCMo0QaBBBAYBQKzJgxo1HDzrPL1XWNSn+VW8OXS596EUAgrgAj03GlSIcAAgiMMoFdmWC+uuw8z7kQTBqVfqG2xv9wIcqiDAQQQKCYAoxMF1OXshFAAIFqFijTFA8F0hlN73h9R0fHs9XMR9sRQGB0CBBMj479TC8RQAABJ4Hm5ulJTfFodcpUoMTW+G/S9I7FBSqOYhBAAIGiChBMF5WXwhFAAIHqFAi9oOQXHmqpve2+MdevSnV8vTrVaDUCCIxGAYLp0bjX6TMCCCCQQ8AYu1HTLXpyJCvYZuOZJz1be05XV+c3C1YoBSGAAAIlECCYLgEyVSCAAALVJpBOpe4ec1T9JI0Uz1OgG92BcHcx+qDR6JTKf6PvN81Op5f/vhh1UCYCCCBQTAFW8yimLmUjUEAB3V0uNGGw3anI0BQlAHJow+7oq3uH9J4fJIZ7nw+X6kg7hMDSpUsz2hzdAvyBWbNmjdm1K/Pn1gaXWWsu1hof06y1Y4bIPugmjXiv86z9le97X0+lUo/sTdg5aHo2IIAAApUsUJYljyoZhLYhgAACCOQWUCBtWltbJ+qehwqqzVQThhM8zx+nixaPVu7o3zhrvNBYu1m/7/nn+/7qMKx5NJ1etjZ3DaRAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEBg5An8fztNmCPvgQrQAAAAAElFTkSuQmCC";

      var r = new Random();
      PasswordAndSalt password = PasswordHasher.Hash("test1234");
      Console.WriteLine("", password.PasswordHash); // manually suppress "unused variable" warning
      Console.WriteLine("", white_pixel); // manually suppress "unused variable" warning
      Console.WriteLine("", cute_image); // manually suppress "unused variable" warning
      Console.WriteLine("", hoppinger_logo); // manually suppress "unused variable" warning

      context.Database.EnsureCreated();

      
      seed_Americans = () => {
        
        if (!context.American.Any())
        {
          var _American = new System.Collections.Generic.List<American>();
          
          
            
            _American.Add(new American { Id = 2, CreatedDate = DateTime.Now, Description = "American",   });

          foreach (var x in _American)
          {
            context.American.Add(x);
          }
          context.SaveChanges();
        }
        Americans = context.American.ToArray();
      };
      seed_Meals = () => {
        
        if (!context.Meal.Any())
        {
          var _Meal = new System.Collections.Generic.List<Meal>();
          // nothing here: class is abstract
          
          foreach (var x in _Meal)
          {
            context.Meal.Add(x);
          }
          context.SaveChanges();
        }
        Meals = context.Meal.ToArray();
      };
      seed_Asians = () => {
        
        if (!context.Asian.Any())
        {
          var _Asian = new System.Collections.Generic.List<Asian>();
          
          
            
            _Asian.Add(new Asian { Id = 1, CreatedDate = DateTime.Now, Description = "Asian",   });

          foreach (var x in _Asian)
          {
            context.Asian.Add(x);
          }
          context.SaveChanges();
        }
        Asians = context.Asian.ToArray();
      };
      seed_Recipess = () => {
        
        if (!context.Recipes.Any())
        {
          var _Recipes = new System.Collections.Generic.List<Recipes>();
          
          
            
            _Recipes.Add(new Recipes { Id = 4, CreatedDate = DateTime.Now, Picture = "", Name = "Sizzling steak stir-fry/", Ingredients = "320 g tenderstem broccoli, 2 x 250 g lean flank steak, 2 teaspoons coriander seeds, 250 g medium free-range egg noodles, 3 teaspoons sesame oil, 1 red onion, 2 cloves of garlic, 6 cm piece of fresh ginger, olive oil, 3 tablespoons soy sauce, 1 lime, 1 fresh red chilli/", Description = "1. Trim the broccoli, cutting any larger broccoli stems in half lengthways, then place in a heatproof bowl and cover with boiling water. Add a good pinch of sea salt and leave for 10 minutes, then drain and put to one side. Half-fill a pan with water and bring to the boil. 2. Slice the steaks against the grain into finger-sized strips and season with sea salt and black pepper. 3. Pound the coriander seeds in a pestle and mortar, or bash with the base of a pan, until fine. Sprinkle over the steak so they stick to it and give it a lovely, fragrant flavour. 4. Drop the noodles into the pan of boiling salted water and cook until just tender. Drain, then toss with 2 teaspoons of sesame oil and return to the pan. Cover to keep warm. 5. Peel and finely slice the onion and garlic, then peel and finely chop the ginger. 6. Heat a splash of olive oil in a wok or large frying pan over a high heat, then add the onions, garlic and ginger. Fry for a couple of minutes, or until the onions have softened slightly. 7. Add the seasoned pieces of steak and stir-fry for 1 to 2 minutes, then add the broccoli and fry for a further 2 minutes, stirring constantly. 8. Pour in the soy sauce and 1 teaspoon of sesame oil, toss in the pan until everything is well coated, then serve with the egg noodles. 9. Cut the lime into wedges for squeezing over, and finely slice the chilli (deseed if you like), then sprinkle over the top./", PreparationTime = 25,   });

            
            _Recipes.Add(new Recipes { Id = 5, CreatedDate = DateTime.Now, Picture = "", Name = "Sweet and Spicy Asian Meatball and Broccoli Noodles/", Ingredients = "1/2 lb ground turkey, 1 egg, 1/2 up Progresso™ plain panko crispy bread crumbs, 1/2 cup finely chopped onion (1 medium), 2 teaspoons grated gingerroot, 1/2 teaspoon salt, 1/4 teaspoon pepper, 4 green onions, thinly sliced (1/4 cup), 1 two 2 cloves garlic, finely chopped, 3 cups fresh broccoli florets, Canola oil, 1/4 cup reduced-sodium soy sauce, 2 tablespoons sambal oelek or Sriracha, 2 tablespoons real maple syrup, 2 teaspoons fish sauce, 2 teaspoons lime juice, 1 teaspoon grated gingerroot, 1 clove garlic finely chopped, 8 oz uncooked capellini or angel hair pasta/", Description = "1. Heat oven to 425°F. Line cookie sheet with sides or shallow baking pan with cooking parchment paper. 2. In large bowl, mix all Meatball ingredients except broccoli and oil until well combined. Shape meatballs using 1 heaping teaspoonful mixture for each; place in cookie sheet. Arrange broccoli in cookie sheet. Drizzle broccoli with oil. 3. Bake 25 to 30 minutes or until meatballs are thoroughly cooked and no longer pink in center, and broccoli is browned around edges. 4. While meatballs and broccoli are baking, mix Sauce ingredients. 5. Cook and drain capellini as directed on package. Toss capellini with sauce, meatballs and broccoli. /", PreparationTime = 35,   });

            
            _Recipes.Add(new Recipes { Id = 6, CreatedDate = DateTime.Now, Picture = "", Name = "Blackened Grouper Sandwiches with Rémoulade/", Ingredients = "1 teaspoon paprika, 3/4 teaspoon black pepper, 1/4 teaspoon kosher salt, 4 (6-oz.) grouper fillets, 2 tablespoons canola oil, 1/4 cup canola mayonnaise, 1 1/2 tablespoons sweet pickle relish, 1 tablespoon grainy mustard, 1 tablespoon unsalted ketchup, 4 (2-oz.) whole-wheat hoagie rolls, split, 4 romaine lettuce leaves, 8 plum tomato slices/", Description = " 1. Preheat broiler to high with oven rack 8 inches from the heat. 2. Combine paprika, pepper, and salt in a small bowl. Rub spice mixture evenly over fillets. 3. Heat oil in a large nonstick skillet over medium-high. Add fillets to pan; cook 3 to 4 minutes on each side. 4. Combine mayonnaise, relish, mustard, and ketchup in a bowl. Arrange rolls, cut sides up, on a baking sheet; broil 1 minute or until toasted. Spread mayonnaise mixture over cut sides of rolls. Top bottom halves of rolls with lettuce, tomato, fillets, and top halves of rolls./", PreparationTime = 30,   });

            
            _Recipes.Add(new Recipes { Id = 7, CreatedDate = DateTime.Now, Picture = "", Name = "Classic American Cheeseburger", Ingredients = "2pounds    freshly ground chuck,1    tablespoon    onion powder,1    teaspoon    salt,1    teaspoon    freshly ground black pepper,12    slices    deli-counter American cheese,6    large    burger buns, preferably homemade, toasted if desired", Description = "In a large bowl, mix ground beef, onion powder, salt and pepper until just combined. Do not overmix, or your patties will be tough. Divide into six portions and form patties, without pressing too hard. They should be uniform in thickness. Smooth out any cracks using your fingers. Make these right before you grill them, so they stay at room temperature. Preheat your grill, grill pan or cast-iron skillet to high heat and add burger patties. If using a grill, cover with the lid.Cook until the crust that forms on the bottom of the burger releases it from the pan or grate — about 2 minutes. Gently test, but don't flip it until it gets to this point. When burgers lift up easily, flip, add two slices of cheese to each, close lid if using a grill, and cook on the other side for another 2-3 minutes for medium to medium rare. Remove burgers with a sturdy metal spatula and transfer to a plate. Allow to rest for several minutes, then transfer to buns.Garnish as desired and serve immediately. ", PreparationTime = 60,   });

            
            _Recipes.Add(new Recipes { Id = 8, CreatedDate = DateTime.Now, Picture = "", Name = "American Manchego Cheese Omelette", Ingredients = "8 large eggs, 1/4 cup milk. cooking oil as needed,1 avocado - sliced,1/4 cup yellow bell pepper - diced,1/4 cup red and green bell pepper - diced,1 Jalapeno pepper - seeded and finely diced,1/4 cup onion - diced,1 Tablespoon fresh cilantro - minced, 2 teaspoons fresh parsley - chopped,salt - to taste,ground black pepper - to taste,1 1/4 cup Spanish Manchego cheese - shredded", Description = " Saute peppers and onions in a small amount of oil. Add cilantro and parsley, season with salt and pepper. Cook until tender. Reserve. Combine eggs and milk. Mix well and reserve. Heat a non-stick omelette or egg pan over medium heat. Portion beaten egg into pan. Stir in sauteed pepper and onion. Cook until set. Flip omelette and cook until done. Add sliced avocado and top with cheese. Fold omelette and turn out onto warm serving plates. Top with additional cheese and garnish with fresh cilantro sprigs. Repeat process to create 4 servings", PreparationTime = 20,   });

            
            _Recipes.Add(new Recipes { Id = 9, CreatedDate = DateTime.Now, Picture = "", Name = "Applesauce Pancakes", Ingredients = "1 and 1/4 cups applesauce,1 cup all-purpose flour,1/2 cup milk,1 large egg - lightly beaten,1 Tablespoon butter - melted,1 and 1/2 teaspoons baking powder,1/2 teaspoon vanilla,1/4 teaspoon salt", Description = "These pancakes tend to be way more moist than your average pancakes. Some people like that because you get a real sense of the applesauce in the recipe. Other say it's too 'gooey'. Personally, I like it for a change of pace from normal pancakes", PreparationTime = 60,   });

            
            _Recipes.Add(new Recipes { Id = 10, CreatedDate = DateTime.Now, Picture = "", Name = "Stuffed peppers", Ingredients = "4 red peppers, 2 x 250g pouches cooked tomato rice (we used Tilda Rizazz Mediterranean Tomato), 2 tbsp pesto, handful pitted black olives (chopped), 200g goat's cheese (sliced)", Description = "1. Use a small knife to cut the top out of the peppers, then scoop out the seeds. Sit the peppers on a plate, cut-side up, and cook in the microwave on High for 5-6 mins until they have wilted and softened. 2. While the peppers are cooking, mix the rice together with the pesto and olives and two-thirds of the cheese. Scoop the rice into the peppers, top with the remaining goat’s cheese and continue to cook for 8-10 mins", PreparationTime = 15,   });

            
            _Recipes.Add(new Recipes { Id = 11, CreatedDate = DateTime.Now, Picture = "", Name = "Chili con Carne", Ingredients = "2 tablespoons of Olive oil, 2 onions, 2 garlics. , 2 carrots, 2 celeries, 2 Bell peppers, 1 teaspoon chilipowder, 1 teaspoon of grinded cumin, 1 teaspoon of cinnamon, Salt and pepper, 400 grams of chickpeas, 400 grams of red kidney beans, 800 grams of finely sliced tomatoes, 500 grams of high quality beef, 1 handful of coriander, 2 tablespoons of balsamic vinegar, 400 grams of basmati rice, A big pot, A frying pan.", Description = "1. Put your frying pan on medium to high heat. Put the 2 tablespoons of olive oil and the diced vegetables in the frying pan. 2. Add the chillipowder, the grinded cumin, the cinnamon and a little salt and pepper. Cook for 7 minutes and stir the dish every 30 seconds until the vegetables are soft. 3. Add the chickpeas, kidneybeans, the finely sliced tomatoes and the high quality beef. Add about 600-800ml of water in the frying pan. 4. Add the finely diced coriander to the dish and add the 2 tablespoons balsamic vinegar.  After that cook the dish for an hour on low heat, while stirring it once 15-30 minutes. In the meanwhile cook the basmati rice with saltwater. 5. Share the dish with your family, friends or colleagues! ", PreparationTime = 70,   });

            
            _Recipes.Add(new Recipes { Id = 12, CreatedDate = DateTime.Now, Picture = "", Name = "Chicken French", Ingredients = "1/4 cup all-purpose flour, or as needed salt and black pepper to taste , 2 eggs beaten, 1 tablespoon white sugar , 1 tablespoon grated Parmesan cheese, 2 tablespoons olive oil, 4 skinless, boneless chicken breast halves, 1/4 cup butter, 2 teaspoons minced garlic, 1/4 cup dry sherry, 1/4 cup lemon juice, 2 teaspoons low-sodium chicken base", Description = "1. Mix together the flour, salt, and pepper in a shallow bowl. 2. In another bowl, whisk beaten eggs, sugar, and Parmesan cheese until the mixture is thoroughly blended and the sugar has dissolved. 3. Heat olive oil in a large skillet over medium heat until the oil shimmers. 4. Dip the chicken breasts into the flour mixture, then into the egg mixture, and gently lay them into the skillet. 5. Pan-fry the chicken breasts until golden brown and no longer pink in the middle, about 6 minutes on each side. 6. Remove from the skillet and set aside. 7. In the same skillet over medium-low heat, melt the butter, and stir in garlic, sherry, lemon juice, and chicken base. 8. Bring the sauce to a simmer, and stir until smooth and slightly thickened, about 5 minutes. 9. Be sure to dissolve any brown flavor bits from the bottom of the skillet as you stir. 10. Return the chicken breasts to the sauce, and gently simmer until no longer pink in the center, about 15 minutes. 11. To serve, place a chicken breast on a plate, and top with sauce.", PreparationTime = 30,   });

            
            _Recipes.Add(new Recipes { Id = 13, CreatedDate = DateTime.Now, Picture = "", Name = "Baked Eggs", Ingredients = "4 rashers of streaky bacon, 1 tbsp oil, 4 eggs, 4 tbsp, cream, 4 tbsp grated cheese of your choice, 4 slices of bread, toasted, buttered and cut into dippers to eat with them", Description = "1. Turn oven to 180°C and boil the kettle 2. Fry bacon rashers until really crispy, allow to cool and then break into pieces 3. Put 4 ramekins in front of you. Divide the eggs, bacon, cream, cheese, chives and seasoning into each. 4. Place ramekins into a roasting tray and quarter to half fill with water. Place in oven for 10-15 min until baked through.", PreparationTime = 15,   });

            
            _Recipes.Add(new Recipes { Id = 14, CreatedDate = DateTime.Now, Picture = "", Name = "Asian Oatmeal Breakfast Bowl", Ingredients = " 1/2 teaspoon sesame seeds, 1 ounce low-fat cream cheese, at room temperature, 1 tablespoon hot-pepper paste, such as gochujang, 1 cup low-sodium chicken broth, 1/3 cup old-fashioned rolled oats, Salt, optional, Cooking spray, 1 large egg, 1 spring onion, sliced, 1 sheet nori, cut into thin ribbons with kitchen shears", Description = " Swirl the sesame seeds in a small nonstick skillet over medium heat until they begin to brown and toast, 3 to 4 minutes. Transfer to a small bowl; set aside. Stir together the cream cheese, hot-pepper paste and 1 tablespoon water with a rubber spatula in another small bowl until combined. Refrigerate until ready to use. Bring the chicken broth, oats, 1 cup water and a pinch of salt, if using, to a simmer in a small saucepan over medium-high heat and cook, stirring frequently, until the oats soften and breakdown and the mixture is the consistency of a loose porridge, 15 to 20 minutes. Pour into a cereal bowl, cover and keep warm. Generously spray the skillet with cooking spray, and set over medium-high heat. Crack the egg into a mug or small bowl, and carefully slide it into the hot skillet. Cook until the white is set and brown and crispy on the bottom and edges and the yolk is still runny, 2 to 3 minutes. Use a spatula to help slide the egg on top of the oatmeal. Then arrange neat piles of the cream cheese-pepper sauce, spring onions and nori on top of the oatmeal. Sprinkle with the toasted sesame seeds. Then take a photo!", PreparationTime = 30,   });

            
            _Recipes.Add(new Recipes { Id = 15, CreatedDate = DateTime.Now, Picture = "", Name = "Mediterranean Breakfast Couscous", Ingredients = " 3 cups 1 percent low-fat milk, 1 (2-inch) cinnamon stick, 1 cup uncooked whole-wheat couscous, ½ cup chopped dried apricots, ¼ cup dried currants,6 teaspoons dark brown sugar, divided,¼ teaspoon salt, 4 teaspoons butter, melted and divided", Description = " Combine milk and cinnamon stick in a large saucepan over medium-high heat; heat 3 minutes or until small bubbles form around inner edge of pot (about 180 degrees Fahrenheit.) Do not boil. Remove from heat; stir in couscous, apricots, currants, 4 teaspoons brown sugar, and salt. Cover the mixture, and let it stand 15 minutes. Remove and discard cinnamon stick. Divide couscous among each of 4 bowls, and top each with 1 teaspoon melted butter and ½ teaspoon brown sugar. Serve immediately.", PreparationTime = 20,   });

            
            _Recipes.Add(new Recipes { Id = 16, CreatedDate = DateTime.Now, Picture = "", Name = " Chickpea and Potato Hash", Ingredients = " 4 cups frozen shredded hash brown potatoes, 2 cups finely chopped baby spinach, ½ cup finely chopped onion, 1 tablespoon minced fresh ginger, 1 tablespoon curry powder, ½ teaspoon salt, ¼ cup extra-virgin olive oil, 1 (15-ounce) can chickpeas, rinsed, 1 cup chopped zucchini, 4 large eggs", Description = "  Combine potatoes, spinach, onion, ginger, curry powder, and salt in a large bowl. Heat oil in a large nonstick skillet over medium-high heat. Add the potato mixture and press into a layer. Cook, without stirring, until crispy and golden brown on the bottom, 3 to 5 minutes. Reduce heat to medium-low. Fold in chickpeas and zucchini, breaking up chunks of potato, until just combined. Press back into an even layer. Carve out 4 “wells” in the mixture. Break eggs, one at a time, into a cup and slip one into each indentation. Cover and continue cooking until the eggs are set, 4 to 5 minutes for soft-set yolks.", PreparationTime = 45,   });

            
            _Recipes.Add(new Recipes { Id = 17, CreatedDate = DateTime.Now, Picture = "", Name = " Quick and Easy Kimchi Salad", Ingredients = " 1 small head cabbage, shredded 1/4 cup rock salt 1 small carrot, cut into thin strips 3 tablespoons vinegar 2 tablespoons vegetable oil 1 tablespoon white sugar, or to taste 1 teaspoon sesame oil 1 teaspoon toasted sesame seeds, ground 1/2 teaspoon cayenne pepper, or to taste 1/4 teaspoon sal", Description = "  Combine cabbage and rock salt together in a bowl. Let stand 15 minutes, stirring often. Rinse lightly and drain. Mix cabbage, carrot, vinegar, vegetable oil, sugar, sesame oil, sesame seeds, cayenne pepper, and salt together in a bowl. Refrigerate until chilled, at least 30 minutes.", PreparationTime = 65,   });

          foreach (var x in _Recipes)
          {
            context.Recipes.Add(x);
          }
          context.SaveChanges();
        }
        Recipess = context.Recipes.ToArray();
      };
      seed_Lunches = () => {
        
        if (!context.Lunch.Any())
        {
          var _Lunch = new System.Collections.Generic.List<Lunch>();
          
          
            
            _Lunch.Add(new Lunch { Id = 2, CreatedDate = DateTime.Now, Description = "Lunch",   });

          foreach (var x in _Lunch)
          {
            context.Lunch.Add(x);
          }
          context.SaveChanges();
        }
        Lunches = context.Lunch.ToArray();
      };
      seed_Users = () => {
        
        if (!context.User.Any())
        {
          var _User = new System.Collections.Generic.List<User>();
          
          
            password = PasswordHasher.Hash("test1234");
            _User.Add(new User { Id = 1, CreatedDate = DateTime.Now, Username = "user1", Language = "en", Email = "user1@us.er",  PasswordHash = password.PasswordHash, PasswordSalt = password.PasswordSalt });

            password = PasswordHasher.Hash("test1234");
            _User.Add(new User { Id = 2, CreatedDate = DateTime.Now, Username = "user2", Language = "en", Email = "user2@us.er",  PasswordHash = password.PasswordHash, PasswordSalt = password.PasswordSalt });

            password = PasswordHasher.Hash("test1234");
            _User.Add(new User { Id = 3, CreatedDate = DateTime.Now, Username = "user3", Language = "en", Email = "user3@us.er",  PasswordHash = password.PasswordHash, PasswordSalt = password.PasswordSalt });

          foreach (var x in _User)
          {
            context.User.Add(x);
          }
          context.SaveChanges();
        }
        Users = context.User.ToArray();
      };
      seed_HomePages = () => {
        
        if (!context.HomePage.Any())
        {
          var _HomePage = new System.Collections.Generic.List<HomePage>();
          
          
            
            _HomePage.Add(new HomePage { CreatedDate = DateTime.Now,   });

          foreach (var x in _HomePage)
          {
            context.HomePage.Add(x);
          }
          context.SaveChanges();
        }
        HomePages = context.HomePage.ToArray();
      };
      seed_Admins = () => {
        
        if (!context.Admin.Any())
        {
          var _Admin = new System.Collections.Generic.List<Admin>();
          
          
            password = PasswordHasher.Hash("test1234");
            _Admin.Add(new Admin { Id = 1, CreatedDate = DateTime.Now, Username = "admin", Language = "en", Email = "admin@ad.min",  PasswordHash = password.PasswordHash, PasswordSalt = password.PasswordSalt });

          foreach (var x in _Admin)
          {
            context.Admin.Add(x);
          }
          context.SaveChanges();
        }
        Admins = context.Admin.ToArray();
      };
      seed_Dinners = () => {
        
        if (!context.Dinner.Any())
        {
          var _Dinner = new System.Collections.Generic.List<Dinner>();
          
          
            
            _Dinner.Add(new Dinner { Id = 3, CreatedDate = DateTime.Now, Description = "Dinner",   });

          foreach (var x in _Dinner)
          {
            context.Dinner.Add(x);
          }
          context.SaveChanges();
        }
        Dinners = context.Dinner.ToArray();
      };
      seed_Mediterraneans = () => {
        
        if (!context.Mediterranean.Any())
        {
          var _Mediterranean = new System.Collections.Generic.List<Mediterranean>();
          
          
            
            _Mediterranean.Add(new Mediterranean { Id = 3, CreatedDate = DateTime.Now, Description = "Mediterranean",   });

          foreach (var x in _Mediterranean)
          {
            context.Mediterranean.Add(x);
          }
          context.SaveChanges();
        }
        Mediterraneans = context.Mediterranean.ToArray();
      };
      seed_Breakfasts = () => {
        
        if (!context.Breakfast.Any())
        {
          var _Breakfast = new System.Collections.Generic.List<Breakfast>();
          
          
            
            _Breakfast.Add(new Breakfast { Id = 1, CreatedDate = DateTime.Now, Description = "Breakfast",   });

          foreach (var x in _Breakfast)
          {
            context.Breakfast.Add(x);
          }
          context.SaveChanges();
        }
        Breakfasts = context.Breakfast.ToArray();
      };
      seed_Categoriess = () => {
        
        if (!context.Categories.Any())
        {
          var _Categories = new System.Collections.Generic.List<Categories>();
          // nothing here: class is abstract
          
          foreach (var x in _Categories)
          {
            context.Categories.Add(x);
          }
          context.SaveChanges();
        }
        Categoriess = context.Categories.ToArray();
      };
      seed_Ratings = () => {
        
        if (!context.Rating.Any())
        {
          var _Rating = new System.Collections.Generic.List<Rating>();
          
          
          foreach (var x in _Rating)
          {
            context.Rating.Add(x);
          }
          context.SaveChanges();
        }
        Ratings = context.Rating.ToArray();
      };
      seed_Americans();
      seed_Meals();
      seed_Asians();
      seed_Recipess();
      seed_Lunches();
      seed_Users();
      seed_HomePages();
      seed_Admins();
      seed_Dinners();
      seed_Mediterraneans();
      seed_Breakfasts();
      seed_Categoriess();
      seed_Ratings();

      if (!context.Categories_Meal.Any())
      {
        var _Categories_Meal = new Categories_Meal[]
        {
            
            new Categories_Meal { CategoriesId = 3, MealId = 1 },

            new Categories_Meal { CategoriesId = 3, MealId = 2 },

            new Categories_Meal { CategoriesId = 3, MealId = 3 },

            new Categories_Meal { CategoriesId = 2, MealId = 1 },

            new Categories_Meal { CategoriesId = 2, MealId = 2 },

            new Categories_Meal { CategoriesId = 2, MealId = 3 },

            new Categories_Meal { CategoriesId = 1, MealId = 1 },

            new Categories_Meal { CategoriesId = 1, MealId = 2 },

            new Categories_Meal { CategoriesId = 1, MealId = 3 },

        };
        foreach (var x in _Categories_Meal)
        {
          context.Categories_Meal.Add(x);
        }
        context.SaveChanges();
      }
      var Categories_Meal = context.Categories_Meal.ToArray();
      if (!context.User_Recipes.Any())
      {
        var _User_Recipes = new User_Recipes[]
        {
            
        };
        foreach (var x in _User_Recipes)
        {
          context.User_Recipes.Add(x);
        }
        context.SaveChanges();
      }
      var User_Recipes = context.User_Recipes.ToArray();
      if (!context.Recipes_Rating.Any())
      {
        var _Recipes_Rating = new Recipes_Rating[]
        {
            
        };
        foreach (var x in _Recipes_Rating)
        {
          context.Recipes_Rating.Add(x);
        }
        context.SaveChanges();
      }
      var Recipes_Rating = context.Recipes_Rating.ToArray();
      if (!context.Meal_Recipes.Any())
      {
        var _Meal_Recipes = new Meal_Recipes[]
        {
            
            new Meal_Recipes { MealId = 3, RecipesId = 4 },

            new Meal_Recipes { MealId = 3, RecipesId = 11 },

            new Meal_Recipes { MealId = 3, RecipesId = 12 },

            new Meal_Recipes { MealId = 3, RecipesId = 15 },

            new Meal_Recipes { MealId = 3, RecipesId = 10 },

            new Meal_Recipes { MealId = 3, RecipesId = 9 },

            new Meal_Recipes { MealId = 3, RecipesId = 7 },

            new Meal_Recipes { MealId = 3, RecipesId = 5 },

            new Meal_Recipes { MealId = 1, RecipesId = 8 },

            new Meal_Recipes { MealId = 1, RecipesId = 11 },

            new Meal_Recipes { MealId = 1, RecipesId = 13 },

            new Meal_Recipes { MealId = 1, RecipesId = 14 },

            new Meal_Recipes { MealId = 1, RecipesId = 15 },

            new Meal_Recipes { MealId = 1, RecipesId = 9 },

            new Meal_Recipes { MealId = 2, RecipesId = 6 },

            new Meal_Recipes { MealId = 2, RecipesId = 16 },

            new Meal_Recipes { MealId = 2, RecipesId = 17 },

        };
        foreach (var x in _Meal_Recipes)
        {
          context.Meal_Recipes.Add(x);
        }
        context.SaveChanges();
      }
      var Meal_Recipes = context.Meal_Recipes.ToArray();

      InitializePagesAndSingletons(context);
    }
  }
}
