import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Update the English translation with the image
    const { error: enError } = await supabase
      .from('blog_post_translations')
      .update({
        content: `---
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas quis magna eget purus congue pulvinar. Donec eget tellus ut sapien sagittis dignissim. Proin euismod sapien ut magna commodo, et placerat lectus pellentesque. Nam sagittis sapien risus, ac cursus nisi molestie sed. Donec feugiat gravida viverra. Nam quis dignissim augue, a interdum ex. Cras aliquet erat faucibus, ultricies sem ut, faucibus libero. Donec pharetra massa id nisl porta, id vehicula lectus fermentum. In tellus orci, fermentum ut tristique eu, volutpat ut elit. In hac habitasse platea dictumst. Nullam eu finibus ex. Nulla facilisi. Sed sagittis maximus blandit. Nam consequat ipsum orci, eu ultrices ipsum venenatis quis. Duis posuere ex sem, in pulvinar nisi varius a.

![](https://jpejuoyhuuwlgqvtwtrm.supabase.co/storage/v1/object/public/blog-images/1752892796901-hc7i6w.jpg)

Ut mollis sodales congue. Integer condimentum, turpis id ornare sagittis, risus quam cursus leo, ac lobortis dolor felis quis lorem. Vivamus tincidunt convallis arcu at interdum. Sed nisi libero, convallis et elit vitae, efficitur scelerisque elit. Donec cursus neque et porta maximus. Sed malesuada lectus mi, in semper urna aliquam vitae. Aenean blandit vitae odio et gravida. Etiam pellentesque non mi ac malesuada. Vivamus lacinia lacus tortor, semper tristique nisl ultricies vitae. Nunc tincidunt, urna sed mattis consectetur, massa sapien lobortis mi, at sodales justo augue non sem. Ut mi erat, lacinia at nisl et, dignissim faucibus nisl. Nam eget suscipit metus, sed laoreet lacus. Fusce viverra bibendum nulla, ac vulputate lorem laoreet et.

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas velit sapien, porta aliquet nunc porta, consequat sagittis massa. Nunc rhoncus lorem ut laoreet consequat. Sed vulputate, mauris nec auctor maximus, mi metus volutpat purus, id placerat est erat vel lectus. Pellentesque a ligula eget dolor finibus sodales. Suspendisse potenti. Nulla mattis justo non maximus ultrices. In sagittis a ipsum eget congue. Praesent pharetra, ante a ullamcorper porta, neque orci aliquam augue, a pretium libero eros in dolor. In finibus sagittis erat, eget facilisis arcu semper ut. Nunc et tempus lacus, quis commodo lectus. Nunc eget diam a dui venenatis convallis ut sit amet felis. Mauris laoreet congue ipsum, non volutpat sem scelerisque non. Donec blandit nunc id viverra pellentesque.

Proin laoreet metus odio, non convallis diam bibendum eget. Suspendisse tristique in velit id euismod. Integer dapibus enim et sollicitudin placerat. Etiam bibendum viverra sem sed venenatis. Nulla facilisi. Nullam volutpat venenatis sodales. Duis suscipit tincidunt orci quis pharetra. Quisque sodales, purus eu ultricies eleifend, ipsum enim venenatis leo, vitae pellentesque arcu neque et erat. Morbi tempus condimentum lectus eu mollis. In ultrices, nunc sit amet fermentum imperdiet, sem ipsum congue tortor, quis eleifend augue risus elementum felis. Duis eget libero vel leo aliquet scelerisque. Nam venenatis urna nec posuere feugiat. Morbi in sagittis leo, a laoreet enim. Cras rhoncus, ex in ullamcorper maximus, ante nisl interdum libero, ut ultrices lacus elit eu tellus. Pellentesque sit amet euismod dolor.

Nam accumsan dictum velit eget pretium. Nunc placerat mollis elit sit amet eleifend. Ut convallis varius diam quis tristique. Nullam non ante quis ante efficitur sagittis. Fusce ac purus neque. Maecenas ut nisl nec dui laoreet ultrices non in erat. Donec accumsan erat eget orci ullamcorper ullamcorper. Nunc condimentum nulla sit amet orci semper ultricies. Nam blandit sed velit ac volutpat. Donec sed nibh non elit sollicitudin bibendum eget vitae turpis. In sodales, velit in porta ultrices, ligula eros tempus augue, eu consequat ex sapien nec ex. Mauris consequat odio purus, et varius augue tincidunt in.`
      })
      .eq('blog_post_id', 36)
      .eq('language_code', 'en')

    if (enError) {
      console.error('Error updating English translation:', enError)
      return Response.json({ error: enError.message }, { status: 500 })
    }

    return Response.json({ success: true, message: 'Image added to English version successfully' })
  } catch (err: any) {
    console.error('Error updating image URL:', err)
    return Response.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
} 